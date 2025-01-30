import Image from "next/image";

const BigPic = () => {
  return (
    <div className="relative w-full h-[500px]">
      <Image
  src="https://via.placeholder.com/800x600"
  alt="Test Image"
  fill
  className="object-cover lg:rounded-[8px]"
/>

    </div>
  );
};

export default BigPic;
