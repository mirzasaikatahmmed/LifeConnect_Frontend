// import { Heart, Menu, X } from "lucide-react";
// import Button from "./Button";
// import React from "react";
// const Navigation = () => {
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
//   const navItems = [
//     { name: 'Home', href: '#' },
//     { name: 'About', href: '#about' },
//     { name: 'Donate', href: '#donate' },
//     { name: 'Find Drive', href: '#drives' },
//     { name: 'Contact', href: '#contact' }
//   ];
  
//   return (
//     <nav className="bg-white shadow-lg sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex items-center space-x-2">
//             <div className="bg-red-600 p-2 rounded-full">
//               <Heart className="h-6 w-6 text-white" />
//             </div>
//             <span className="text-xl font-bold text-gray-900">LifeBlood</span>
//           </div>
          
//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             {navItems.map((item) => (
//               <a
//                 key={item.name}
//                 href={item.href}
//                 className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200"
//               >
//                 {item.name}
//               </a>
//             ))}
//             <Button size="sm">Donate Now</Button>
//           </div>
          
//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="text-gray-700 hover:text-red-600 focus:outline-none"
//             >
//               {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>
        
//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="md:hidden bg-white border-t">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               {navItems.map((item) => (
//                 <a
//                   key={item.name}
//                   href={item.href}
//                   className="block px-3 py-2 text-gray-700 hover:text-red-600 font-medium"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {item.name}
//                 </a>
//               ))}
//               <div className="px-3 py-2">
//                 <Button size="sm" className="w-full">Donate Now</Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };
// export default Navigation;
import { Heart } from "lucide-react";
import Button from "./Button";
import React from "react";
import Link from "next/link";

const Navigation = () => {
  const navItems = [
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Donate", href: "#donate" },
    { name: "Find Drive", href: "#drives" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-red-600 p-2 rounded-full">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">LifeConnect</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            <Button size="sm">Donate Now</Button>
          </div>

          {/* Mobile menu toggle button */}
          <div className="md:hidden">
            <input id="menu-toggle" type="checkbox" className="hidden peer" />
            <label
              htmlFor="menu-toggle"
              className="cursor-pointer text-gray-700 hover:text-red-600"
            >
              {/* Hamburger / Close icon */}
              <svg
                className="h-6 w-6 peer-checked:hidden"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className="h-6 w-6 hidden peer-checked:block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </label>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="hidden peer-checked:block md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-gray-700 hover:text-red-600 font-medium"
              >
                {item.name}
              </a>
            ))}
            <div className="px-3 py-2">
              <Button size="sm" className="w-full">
                Donate Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
