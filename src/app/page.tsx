import Image from "next/image";
import Footer from "@/components/Home/footer"
import Contact from "@/components/Home/contact";
import Navbar from "@/components/Home/navbar";
import Eps from '@/components/Home/eps';
import FindUs from '@/components/Home/FindUs';
import Chapters from "@/components/Home/chapters";
import Background from "@/components/Home/background";
export default function Home() {
  return (
    <div>
      <Navbar/>
      <Background/>
      <Eps/>
      <Chapters/>
      <FindUs/>
      <Footer/>
    </div>
  );
}
