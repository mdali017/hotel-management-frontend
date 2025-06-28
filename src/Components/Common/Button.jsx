const Button = ({ text, onClick })  => {
  return (
    <>
      <button
        className="text-sm border-accent  text-accent hover:bg-accent p-2 my-2 border w-full tracking-widest hover:text-white uppercase duration-500 font-semibold rounded-lg"
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
};

export default Button;
