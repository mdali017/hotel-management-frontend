import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import { Swiper, SwiperSlide } from 'swiper/react';
import roomTypesArray from '../../Components/ViewBooking/Data';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

import { EffectFade, Navigation } from 'swiper/modules';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { fadeIn } from '../../variants';
import HeadingTag from '../Common/HeadingTag';
// import ViewAllModal from "../ViewAllModal/ViewAllModal";
import { Link } from 'react-router-dom';

const Booking = () => {
	const slideRef = useRef(null);
	const swiperRef = useRef(null);

	const goToNextSlide = () => {
		if (swiperRef.current && swiperRef.current.swiper) {
			swiperRef.current.swiper.slideNext();
		}
	};

	const goToPrevSlide = () => {
		if (swiperRef.current && swiperRef.current.swiper) {
			swiperRef.current.swiper.slidePrev();
		}
	};

	return (
		<div className=' mx-auto px-0 md:px-10'>
			<HeadingTag text={'ACCOMMODATION'} />
			<div>
				<Swiper
					speed={1000}
					ref={swiperRef}
					centeredSlides={true}
					slidesPerView={1}
					watchOverflow={true}
					loop={true}
					effect='fade'
					modules={[Navigation, EffectFade]}>
					{roomTypesArray.map((item, index) => (
						<SwiperSlide key={index} ref={slideRef}>
							<div className='relative'>
								<motion.div
									variants={fadeIn('right', 0.5)}
									initial='hidden'
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.5 }}
									whileInView={'show'}
									viewport={{ once: true, amount: 0.7 }}
									className='w-full h-[400px]  md:h-[520px] lg:w-4/5 overflow-hidden'>
									<img
										className='w-full h-full -z-30 hover:scale-110 duration-700 object-cover object-center'
										src={item.image}
										alt='ACCOMMODATION'
									/>
								</motion.div>

								<motion.div
									variants={fadeIn('left', 0.5)}
									initial='hidden'
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.5 }}
									whileInView={'show'}
									viewport={{ once: true, amount: 0.7 }}
									className='relative lg:absolute flex flex-col items-center justify-center lg:w-[400px] h-[300px] md:-right-0  lg:top-1/4 z-30 p-10 text-gray-900 bg-white  text-center border-4 border-[var(--accent)]'>
									<div className='absolute -top-10 left-5'>
										<button
											onClick={goToPrevSlide}
											className='p-3 text-black bg-[var(--accent)] hover:text-white hover:bg-gray-500 duration-200'>
											<MdArrowBackIosNew className='text-2xl text-primary duration-100' />
										</button>
										<button
											onClick={goToNextSlide}
											className='p-3 text-black bg-[var(--accent)] hover:text-white hover:bg-gray-500 duration-200'>
											<MdArrowForwardIos className='text-2xl text-primary duration-100' />
										</button>
									</div>
									<div>
										<p className='text-3xl font-semibold'>{item?.roomType}</p>
										<p className='my-3 font-[raleway] font-medium text-xs text-justify'>
											{item?.description.slice(0, 350)}. . .
										</p>
										<Link
											to={'/booking'}
											className='border  border-primary px-4 py-1  hover:bg-primary hover:text-white tracking-widest duration-500'>
											Book Now
										</Link>
									</div>
								</motion.div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</div>
	);
};

export default Booking;
