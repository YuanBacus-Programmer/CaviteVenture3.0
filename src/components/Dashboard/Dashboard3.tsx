import React from 'react'
import Image from 'next/image'

const artworks = [
  {
    id: 1,
    title: "The Battle of Binakayan–Dalahican ",
    artist: " (Tagalog: Labanan sa Binakayan–Dalahikan;",
    year: "November 9–11, 1896 ",
    image: "/placeholder.svg?height=400&width=300",
    description: "By the time the revolution began in August 1896, Cavite was one of the first provinces in the Philippines to declare independence from Spain. Earlier in the war, the Filipino revolutionaries under the Supremo Andres Bonifacio, the leader and the instigator of the revolution, attempted to invest then take Manila by force, but was stymied by severe lack of decent weapons in their part as well as the reluctance of other revolutionary provincial armies, especially the ones from Cavite which also had difficulty in mounting such an attack then rather attacked local Spanish garrisons in the province, from taking part of the engagement."
  },
  {
    id: 2,
    title: "Zapote Bridge",
    artist: "built at an unknown date",
    year: 1897,
    image: "/placeholder.svg?height=400&width=300",
    description: "The bridge and its surrounding area was the site of two battles, the Battle of Zapote Bridge (1897) between Filipino revolutionaries and the Spanish colonial government in 1897 during the Philippine Revolution, and the Battle of Zapote River between Filipino and American forces in 1899 during the Philippine–American War."
  },
  {
    id: 3,
    title: "The Diocesan Shrine of Our Lady of Solitude of Porta Vaga",
    artist: "San Roque Parish Church",
    year: 1571,
    image: "/placeholder.svg?height=400&width=300",
    description: "commonly known as San Roque Parish Church, is a Latin Rite Roman Catholic church in Cavite City on Luzon island, the Philippines. It is under the jurisdiction of the Diocese of Imus. The church enshrines Our Lady of Solitude of Porta Vaga, an icon that appeared after an apparition of the Blessed Virgin Mary."
  }
]

const Dashboard3 = () => {
  return (
    <div className="min-h-screen bg-[#fae8b4] text-[#5c4813] p-4 md:p-8 lg:p-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <p key={i} className="text-6xl md:text-8xl font-thin transform -rotate-45 whitespace-nowrap">
            New gallery
          </p>
        ))}
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 md:mb-12 lg:mb-16 text-center">
          New gallery
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative aspect-w-3 aspect-h-4">
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between text-sm mb-2 text-[#80775c]">
                  <span>{artwork.year}</span>
                  <span>{artwork.artist}</span>
                </div>
                <h2 className="text-xl font-semibold mb-2">{artwork.title}</h2>
                <p className="text-sm text-[#80775c]">{artwork.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 md:mt-16 lg:mt-20 text-center">
          <span className="text-2xl md:text-3xl lg:text-4xl font-light relative inline-block">
            All gallery
            <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#5c4813] opacity-50"></span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard3