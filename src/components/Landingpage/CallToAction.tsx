import RightArrow from "@/assets/HeaderImages/arrow-right.svg";
import Image from "next/image";
import starImage from "@/assets/CallToActionImages/star.png";
import springImage from "@/assets/CallToActionImages/spring.png";
import Link from "next/link";

export const CallToAction = () => {
  return (
    <section className="bg-gradient-to-b from-white to-[#cbbd93] py-24 overflow-x-clip">
      <div className="container mx-auto px-4">
        <div className="section-heading relative text-center">
          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-bold">
            Sign up for free today
          </h2>
          <p className="section-description mt-5 text-sm sm:text-base lg:text-lg">
            Enjoy exploring and discovering Cavite ventures in your own hands.
          </p>
          <Image
            src={starImage}
            alt="Star Image"
            width={360}
            height={360}
            className="hidden lg:block absolute -left-[350px] -top-[137px]"
            loading="lazy"
            sizes="(max-width: 1024px) 200px, 360px" // Use appropriate sizes based on screen width
          />
          <Image
            src={springImage}
            alt="Spring Image"
            width={360}
            height={360}
            className="hidden lg:block absolute -right-[331px] -top-[19px]"
            loading="lazy"
            sizes="(max-width: 1024px) 200px, 360px" // Use appropriate sizes based on screen width
          />
        </div>

        <div className="flex gap-4 mt-10 justify-center items-center flex-wrap">
          <Link href="/signup">
            <button className="btn btn-primary px-6 py-3 rounded-md text-white bg-black hover:bg-gray-800 transition-all duration-300">
              Explore for free
            </button>
          </Link>
          <Link href="/learn-more">
            <button className="btn btn-text flex items-center gap-2 px-6 py-3 rounded-md text-black hover:text-gray-700 transition-all duration-300">
              <span>Learn more</span>
              <Image
                src={RightArrow}
                alt="Right Arrow Icon"
                height={20}
                width={20}
                className="h-5 w-5"
                loading="lazy"
                sizes="20px" // Size optimized for the small icon
              />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
