import React from 'react'
import Image from 'next/image'
import Binakayan from '@/assets/BINAKAYAN1.jpg'
import Detail from '@/assets/BINAKAYAN2.jpg'

const Dashboard2 = () => {
  return (
    <div className="min-h-screen bg-[#f5f5eb] p-8 font-serif">
      <div className="max-w-4xl mx-auto">
        <div className="flex">
          <div className="w-1/12 mr-4">
            <h2 className="text-6xl font-bold transform -rotate-90 origin-top-left translate-y-full mt-64">CAVITE</h2>
          </div>
          <div className="w-11/12">
            <div className="relative">
              <Image
                src={Binakayan}
                alt="FILIPINO HISTORY"
                width={800}
                height={300}
                className="w-full h-auto mt-10"
                
              />
              <h1 className="absolute top-4 left-4 text-6xl font-bold text-white">FILIPINO</h1>
              <h1 className="absolute bottom-4 right-4 text-6xl font-bold text-white">HISTORY</h1>
            </div>
            <h2 className="text-4xl font-light mt-8 mb-4">BINAKAYAN</h2>
            <div className="flex">
              <div className="w-1/2 pr-4">
                <h3 className="text-2xl font-bold mb-2">The Battle of Binakayan–Dalahican</h3>
                <p className="text-sm mb-4">
                was a simultaneous battle during the Philippine Revolution that was fought on November 9–11, 1896 that led to a decisive Filipino victory.
                </p>
                <p className="text-sm">
                The twin battle took place at the shores of Binakayan, in the town of Cavite Viejo (also called Cavite el Viejo, now Kawit); Dalahican and Dagatan in Noveleta; and, to minimal extent, in Imus and Bacoor towns in Cavite, Philippines that lasted for two days before the Spanish army retreated demoralized and in disarray
                </p>
              </div>
              <div className="w-1/2 pl-4 flex flex-col justify-between">
                <Image
                  src={Detail}
                  alt="Artwork 1"
                  width={300}
                  height={200}
                  className="w-full h-auto mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard2