import TeamCard from './team_card';
import Image1 from '../../../public/team/image1.jpg';
import Image2 from '../../../public/team/image2.jpg';
import Image3 from '../../../public/team/image3.jpg';
import Image4 from '../../../public/team/image4.jpg';
import Image5 from '../../../public/team/image5.jpg';
import Image6 from '../../../public/team/image6.jpg';
import Footer from '../Home/footer';
import Navbar from '../Home/navbar';
const team = [
  {
    name: 'Anis Mselmi',
    image: Image6,
    position: 'Webmaster',
  },
  {
    name: 'Mahdi Amrouni',
    image:Image4 ,
    position: 'Chair',
  },
  {
    name: 'Jawher Ben Khraief',
    image: Image1,
    position: 'Vice Chair ',
  },
  {
    name: 'Malek Karmeni',
    image: Image2,
    position: 'Secretary',
  },
  {
    name: 'Zeineb Mnasser',
    image: Image3,
    position: 'Project Coordinator',
  },
  {
    name: 'Firas Frigui',
    image: Image5,
    position: 'Treasurer',
  },
];

export default function Team() {
  return (
    <div>
        <Navbar/>
        <section id="team"  className="my-16 mx-auto container w-9/12 h-fit">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-blue-700 mb-3 ">Our Team</h1>
          <p className="text-gray-600">Meet the dedicated individuals .</p>
        </div>
        <div   className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  gap-20 p-4 h-fit  xl:grid-cols-3 ">
          {team.map((member) => (
            <TeamCard key={member.position} infos={member} />
          ))}
        </div>
      </div>
    </section>
    <Footer/>
    </div>
  );
}
