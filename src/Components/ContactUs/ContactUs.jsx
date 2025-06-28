import Axios from 'axios';
import React, { useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { MdEmail, MdSupport } from 'react-icons/md';
import Swal from 'sweetalert2';
import Animation from '../Common/Animation';
import HeadingTag from '../Common/HeadingTag';
import contactImage from "../../assets/Home page/facility1.jpg";

const ContactUs = () => {
	const [loading, setLoading] = useState(true);
	const handleSubmit = e => {
		e.preventDefault();
		const contactUsChuti = {
			name: e.target.name.value,
			email: e.target.email.value,
			phone: e.target.number.value,
			job_title: e.target.jobTitle.value,
			subject: e.target.subject.value,
			message: e.target.message.value,
		};
		e.target.reset();
		try {
			Axios.post(
				'https://backend.hotelorioninternational.com/api/contact',
				contactUsChuti
			).then(res => {
				if (res.status === 200) {
					Swal.fire({
						icon: 'success',
						title: 'Contact Successful!',
						text: 'Thanks for contacting with us.',
					});
				} else {
					Swal.fire({
						icon: 'error',
						title: 'Failed!',
						text: 'Contact us failed. Please try again.',
					});
					console.log(res.data.message);
				}
			});
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Error!',
				text: 'An error occurred. Please try again.',
			});
			console.log(error);
		}
	};
	return (
		<div className='container mx-auto relative pt-[60px] md:pt-[120px] lg:pt-[100px] w-full'>
			<HeadingTag text={'Contact Us'} />
			<div className='px-4 md:px-16 lg:px-28 flex lg:items-center md:gap-10 mb-4 md:mb:8'>
				<div className='w-full md:w-[50%]'>
					<form onSubmit={handleSubmit} className='space-y-3 px-4 md:px-10'>
						<input
							type='text'
							name='name'
							className='border-b border-gray-400 placeholder-gray-400 focus:outline-none w-full p-2'
							placeholder='Your Name'
							required
						/>

						<input
							type='email'
							name='email'
							className='border-b border-gray-400 placeholder-gray-400 focus:outline-none w-full p-2'
							placeholder='Your Email'
							required
						/>

						<input
							type='number'
							name='number'
							className='border-b border-gray-400 placeholder-gray-400 focus:outline-none w-full p-2'
							placeholder='Phone Number'
							required
						/>

						<input
							type='text'
							name='jobTitle'
							className='border-b border-gray-400 placeholder-gray-400 focus:outline-none w-full p-2'
							placeholder='Your Job Title'
							required
						/>

						<input
							type='text'
							name='subject'
							className='border-b border-gray-400 placeholder-gray-400 focus:outline-none w-full p-2'
							placeholder='Let Us Know How We Can Help You'
							required
						/>

						<textarea
							name='message'
							rows='4'
							className='border-b border-gray-400 placeholder-gray-400 focus:outline-none w-full p-2'
							placeholder='Leave A Comment...'
							required></textarea>

						<button
							type='submit'
							className='text-sm border-accent bg-accent p-2 my-2 border tracking-widest text-white uppercase duration-500 font-semibold hover:bg-white hover:text-accent'>
							Send message
						</button>
					</form>
				</div>
				<div className='w-[50%] hidden md:block'>
					<img
						src={contactImage}
						alt='contact us image'
						className='w-full h-full object-contain'
					/>
				</div>
			</div>
			<div className='my-10 container mx-auto px-4'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-5 text-gray-800'>
					<div className='col-span-1 flex flex-col items-center text-center z-10'>
						<Animation direction={'right'}>
							<MdEmail className='text-3xl lg:text-5xl mx-auto text-blue-600' />
							<h2 className='text-lg md:text-xl font-semibold mb-2'>
								Email us:
							</h2>
							<p>
								Email us for general queries, including marketing and
								partnership opportunities.
							</p>
							<a
								href='mailto:hello@flowbite.com'
								className='text-blue-500 hover:underline'>
								info.hotelorionint@gmail.com
							</a>
						</Animation>
					</div>
					<div className='col-span-1 flex flex-col items-center text-center z-10'>
						<Animation direction={'up'}>
							<FaPhoneAlt className='text-2xl lg:text-4xl mx-auto text-green-600' />
							<h2 className='text-lg md:text-xl font-semibold mb-2'>
								Call us:
							</h2>
							<p>Call us to speak. We are always happy to help.</p>
							<div className='flex flex-col mt-4'>
								<div className='flex flex-col lg:flex-row lg:justify-around'>
									<a
										href='tel:+8801709919827'
										className='text-blue-500 hover:underline'>
										01981-333444
									</a>
									<a
										href='tel:+8801709919825'
										className='text-blue-500 hover:underline'>
										01981-333444
									</a>
								</div>
								
							</div>
						</Animation>
					</div>
					<div className='col-span-1 flex flex-col items-center text-center z-10'>
						<Animation direction={'left'}>
							<MdSupport className='text-3xl lg:text-5xl mx-auto text-blue-900' />
							<h2 className='text-lg md:text-xl font-semibold mb-2'>Support</h2>
							<p>
								Email us for general queries, including marketing and
								partnership opportunities.
							</p>
							<a
								href='mailto:support@flowbite.com'
								className='text-blue-500 hover:underline'>
								info.hotelorionint@gmail.com
							</a>
						</Animation>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactUs;
