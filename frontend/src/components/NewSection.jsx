import {motion} from "motion/react"

function NewSection({children}) {
  return (
    <motion.section initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true}}
      transition={{delay:0.3, duration: 0.6, }} className={`my-20`}>{children}</motion.section>
  )
}

export default NewSection