// Algorithm

/**
 * Step 1: Fetch Eligible Service Providers
 * Criteria:
 * - Must offer the requested subcategory
 * - Must be available
 * - Must be within search radius
 * - Must be verified (optional)
 */

// Step 2: Calculate a score for each provider
// - Based on distance, rating, active jobs, urgency
// - Sort providers by descending score

// Step 3: Check availability with buffer (conflict check)
// - For top scored providers, check if any booking overlaps with the new request (with buffer)

// Step 4: Assign to the first available, highest-scoring provider

import mongoose from "mongoose";
import bookingModel from "../models/booking.model";
import serviceModel from "../models/service.model";

interface AssignmentInput {
  categoryId: mongoose.Types.ObjectId;
  subCategoryId: mongoose.Types.ObjectId;
  longitude: number | string;
  latitude: number | string;
  preferredTime: Date | string;
  durationInMinutes: number;
}

const ASSIGNMENT_WEIGHTS = {
  distance: 1.5,
  rating: 3,
  workload: 4,
};

const assignJob = async ({
  categoryId,
  subCategoryId,
  longitude,
  latitude,
  preferredTime,
  durationInMinutes,
}: AssignmentInput) => {
  console.log({
    categoryId,
    subCategoryId,
    longitude,
    latitude,
    preferredTime,
    durationInMinutes,
  });
  const searchRadius = 20000; // meters
  const bufferMinutes = 15;
  const newStart = new Date(preferredTime);
  const newEnd = new Date(newStart.getTime() + durationInMinutes * 60000);
  const bufferedStart = new Date(newStart.getTime() - bufferMinutes * 60000);
  const bufferedEnd = new Date(newEnd.getTime() + bufferMinutes * 60000);

  const providers = await serviceModel.aggregate([
    {
      $match: {
        categoryId,
        subCategoryId,
      },
    },

    {
      $lookup: {
        from: "serviceproviders",
        let: { providerId: "$serviceProviderId" },
        pipeline: [
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [Number(longitude), Number(latitude)],
              },
              distanceField: "distanceInMeters",
              maxDistance: searchRadius, // 5km in meters
              spherical: true,
              query: {
                $expr: { $eq: ["$_id", "$$providerId"] },
                isAvailable: true,
              },
            },
          },
          {
            $addFields: {
              distanceInKm: { $divide: ["$distanceInMeters", 1000] },
            },
          },
        ],
        as: "Provider",
      },
    },

    { $unwind: "$Provider" },

    { $match: { "Provider.distanceInKm": { $exists: true } } },

    {
      $project: {
        serviceName: 1,
        "Provider._id": 1,
        "Provider.name": 1,
        "Provider.distanceInKm": 1,
        "Provider.location": 1,
        "Provider.isAvailable": 1,
        rating: 1,
      },
    },
  ]);

  // console.log(providers);

  // Score providers
  const maxActiveJobs = 5;

  const scoredProviders = await Promise.all(
    providers.map(async (provider: any) => {
      const activeJobs = await bookingModel.countDocuments({
        serviceProviderId: provider._id,
        status: { $in: ["confirmed", "ongoing"] },
      });

      const score =
        ((searchRadius/1000) - provider?.Provider?.distanceInKm) * ASSIGNMENT_WEIGHTS.distance +
        (provider?.rating || 4.5) * ASSIGNMENT_WEIGHTS.rating +
        (maxActiveJobs - activeJobs) * ASSIGNMENT_WEIGHTS.workload;

      return {
        provider,
        score,
        activeJobs,
      };
    })
  );
  console.log(scoredProviders.map((pvd) => pvd.score));

  scoredProviders.sort((a, b) => b.score - a.score);

  // Check availability for top providers
  for (const candidate of scoredProviders) {
    const hasConflict = await bookingModel.findOne({
      serviceProviderId: candidate.provider._id,
      status: { $in: ["confirmed", "ongoing"] },
      $or: [
        {
          scheduledAt: {
            $lt: bufferedEnd,
          },
          endTime: {
            $gt: bufferedStart,
          },
        },
      ],
    });

    if (!hasConflict) {
      console.log(candidate.provider);
      return candidate.provider;
    }
  }

  return null;
};

export default assignJob;
