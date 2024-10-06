import Image from 'next/image'
import Rosario from '@/assets/CasaDeTajero/Casadetajero.jpg'

export default function ExhibitionPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-4xl md:text-6xl font-serif">
          casa de tejero cavite
          </h1>
          <p className="text-gray-600">
          March 22, 1897
          </p>
          <p className="text-gray-600">
          between Katipunan factions of Magdiwang and Magdalo in San Francisco de Malabon, Cavite (now General Trias) that resulted in the creation of a new revolutionary government that took charge of the Philippine Revolution, replacing the Katipunan.
          </p>
          <p className="text-sm text-gray-500 mt-8">
          Filipino historians consider the first presidential and vice presidential elections in Philippine history to have been held at this convention, although only Katipuneros (members of the Katipunan) were able to take part, and not the general populace.
          </p>
        </div>
        <div className="md:w-1/2">
          <Image
            src={Rosario}
            alt="Chagall Artwork"
            width={800}
            height={600}
            className="w-full h-auto shadow-lg"
          />
        </div>
      </div>
    </div>
  )
}