import Axios from 'axios';
import React from 'react';
import { FetchUrls } from '../Common/FetchUrls';
import Swal from 'sweetalert2';
import { FaPhoneAlt } from 'react-icons/fa';
import HeadingTag from '../Common/HeadingTag';

const InvestorContact = () => {
	const handleSubmit = e => {
		e.preventDefault();
		const contactUsInvestors = {
			name: e.target.name.value,
			email: e.target.email.value,
			phone: e.target.number.value,
			job_title: e.target.jobTitle.value,
			address: e.target.address.value,
			message: e.target.message.value,
		};

		// console.log(contactUsInvestors, 17);

		e.target.reset();
		try {
			Axios.post(
				'https://crm.icicle.dev/api/contactPost',
				contactUsInvestors
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
			<div className='px-4 md:px-16 lg:px-28 flex items-center md:gap-10 mb-4 md:mb:8'>
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
							name='address'
							className='border-b border-gray-400 placeholder-gray-400 focus:outline-none w-full p-2'
							placeholder='Your Address'
							required
						/>

						<textarea
							name='message'
							rows='3'
							className='border-b border-gray-400 placeholder-gray-400 focus:outline-none w-full p-2'
							placeholder='Leave A Comment...'
							required></textarea>

						<button
							type='submit'
							className='text-sm border-secondary bg-secondary p-2 my-2 border tracking-widest text-white uppercase duration-500 font-semibold hover:bg-white hover:text-secondary'>
							Send Message
						</button>
					</form>
					<div>
						<div className='px-4 md:px-10 mt-6'>
							<p className='text-md text-secondary'>📧 suitesale@chutipurbachal.com</p>
							<p className='text-md text-secondary'>📞 +8801711074278</p>
						</div>
					</div>
				</div>
				<div className='w-[50%] hidden md:block'>
					<img
						src='https://img.freepik.com/premium-vector/flat-customer-support-illustration_23-2148897392.jpg'
						alt='contact us image'
						className='w-full h-full object-contain'
					/>
				</div>
			</div>
		</div>
	);
};

export default InvestorContact;
