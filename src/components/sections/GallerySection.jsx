import { motion } from 'framer-motion'
import { SectionHeading } from '../ui/SectionHeading'

export function GallerySection({ images }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Moments"
          title="Our Story In Frames"
          description="A few glimpses from our journey that led us to this celebration."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <motion.figure
              key={image.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              className="romance-card overflow-hidden"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-72 w-full object-cover transition duration-500 hover:scale-105"
                loading="lazy"
              />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
