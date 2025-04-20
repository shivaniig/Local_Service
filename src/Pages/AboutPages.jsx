import { FaTools, FaUserShield, FaHandshake, FaUsers } from "react-icons/fa"

const AboutPages = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      position: "Founder & CEO",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Rajesh has over 15 years of experience in the service industry and founded Fixzy with a vision to transform how home services are delivered.",
    },
    {
      id: 2,
      name: "Priya Sharma",
      position: "Operations Manager",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Priya oversees all service operations and ensures that every customer receives the highest quality service experience.",
    },
    {
      id: 3,
      name: "Amit Patel",
      position: "Technical Lead",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Amit leads our technical team and is responsible for developing and maintaining our digital platform.",
    },
    {
      id: 4,
      name: "Neha Gupta",
      position: "Customer Relations",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Neha ensures that all customer queries and concerns are addressed promptly and effectively.",
    },
  ]

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-white to-blue-100 text-gray-800 p-6 sm:p-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-800 mb-2">About Fixzy</h1>
        <p className="text-lg text-gray-600">Your trusted partner for all home service needs</p>
      </div>

      <section className="max-w-6xl mx-auto mb-16 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Our Story</h2>
          <p className="mb-4">
            Founded in 2018, Fixzy started with a simple mission: to make home services accessible, affordable, and reliable for everyone. What began as a small team of dedicated professionals has now grown into a network of over 500 service providers across Mumbai.
          </p>
          <p className="mb-4">
            We understand the challenges of finding trustworthy professionals for your home service needs. That's why we've built a platform that connects you with verified experts who deliver quality work, every time.
          </p>
          <p>
            Today, Fixzy is one of the leading home service providers in Mumbai, serving thousands of satisfied customers. Our commitment to excellence and customer satisfaction remains at the core of everything we do.
          </p>
        </div>
        <img src="/placeholder.svg?height=400&width=600" alt="Fixzy Team" className="rounded-xl shadow-lg" />
      </section>

      <section className="mb-16 text-center">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-8">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <FaTools size={32} />,
              title: "Quality Service",
              desc: "We are committed to delivering the highest quality service through our network of skilled professionals.",
            },
            {
              icon: <FaUserShield size={32} />,
              title: "Trust & Safety",
              desc: "All our service providers undergo background checks and training to ensure your safety.",
            },
            {
              icon: <FaHandshake size={32} />,
              title: "Reliability",
              desc: "Our professionals arrive on schedule and complete the work efficiently.",
            },
            {
              icon: <FaUsers size={32} />,
              title: "Customer First",
              desc: "We go above and beyond to ensure a seamless service experience for you.",
            },
          ].map((value, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="text-indigo-600 mb-4">{value.icon}</div>
              <h3 className="text-lg font-bold mb-2">{value.title}</h3>
              <p className="text-sm text-gray-600">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-indigo-700 text-center mb-8">Meet Our Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white p-6 rounded-xl shadow-md text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 mx-auto mb-4 rounded-full object-cover"
              />
              <h3 className="font-bold text-lg text-indigo-800">{member.name}</h3>
              <p className="text-sm font-medium text-gray-500">{member.position}</p>
              <p className="text-sm text-gray-600 mt-2">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-white">
          {[
            { stat: "500+", label: "Service Providers" },
            { stat: "10,000+", label: "Happy Customers" },
            { stat: "25,000+", label: "Services Completed" },
            { stat: "4.8/5", label: "Average Rating" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-indigo-600 p-6 rounded-xl shadow-md hover:scale-105 transform transition duration-200"
            >
              <h3 className="text-3xl font-bold">{item.stat}</h3>
              <p className="text-sm mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AboutPages
