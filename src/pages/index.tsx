import React, { useEffect, useRef, useState } from 'react';

import { Camera, Terminal, GraduationCap, Briefcase, Code, User, Plus, Trash2, ChevronRight } from 'lucide-react';
import ResumePreview from './components/ResumePreview';

const CyberResumeBuilder = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    phone: '',
    image: null,
    professionalsummary: '',
    experience: [],
    education: [],
    skills: [],
  });
  const [initialFormData] = useState(formData);
  const [modified, setModified] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const sectionRefs = useRef({});

  const sections = ['personal', 'experience', 'education', 'skills'];

  // Define types for the props
  interface NavItemProps {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // or React.ElementType
    label: string;
    section: string;
    setActiveSection: (section: string) => void; // You need to make sure this is passed as a prop from parent
    activeSection: string; // To check active state
  }

  const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, section }) => (
    <button
      onClick={() => setActiveSection(section)}
      className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-300 ${
        activeSection === section
          ? 'bg-green-500 bg-opacity-20 text-green-400 border border-green-500'
          : 'hover:bg-green-500 hover:bg-opacity-10 text-gray-400 hover:text-green-400'
      }`}>
      <Icon className="w-5 h-5" />
      <span className="flex-1 text-left">{label}</span>
      <ChevronRight className={`w-4 h-4 transition-transform ${activeSection === section ? 'rotate-90' : ''}`} />
    </button>
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    sectionIndex?: number, // Optional, should be a number when passed
    field?: 'experience' | 'education' | 'skills' // Optional, specific fields
  ) => {
    const { name, value, type } = e.target;
    let files: FileList | undefined;

    if (type === 'file') {
      // Safely handle the null case for files
      files = (e.target as HTMLInputElement).files ?? undefined;
    }

    setFormData((prevData) => {
      const updatedFormData = { ...prevData };

      if (sectionIndex !== undefined) {
        // Handle array fields (experience, education, skills)
        if (field === 'experience' || field === 'education') {
          const updatedSection = [...prevData[field]];
          updatedSection[sectionIndex] = {
            ...updatedSection[sectionIndex],
            [name]: value,
          };
          updatedFormData[field] = updatedSection;
        } else if (field === 'skills') {
          const updatedSkills = [...prevData.skills];
          updatedSkills[sectionIndex] = value;
          updatedFormData.skills = updatedSkills;
        }
      } else if (type === 'file' && files) {
        updatedFormData.image = files[0]; // Assign the selected file
      } else {
        updatedFormData[name] = value;
      }

      const isModified = JSON.stringify(updatedFormData) !== JSON.stringify(initialFormData);
      setModified(isModified);

      if (isModified) {
        setShowOutput(false); // Hide output if data is modified
      }

      return updatedFormData;
    });
  };

  const handleAddExperience = () => {
    setFormData((prevData) => ({
      ...prevData,
      experience: [
        ...prevData.experience,
        { companyname: '', position: '', jobdescription: '' },
      ],
    }));
  };

  const handleAddEducation = () => {
    setFormData((prevData) => ({
      ...prevData,
      education: [
        ...prevData.education,
        { institution: '', degree: '', year: '', gpa: '' },
      ],
    }));
  };

  const handleAddSkill = () => {
    setFormData((prevData) => ({
      ...prevData,
      skills: [...prevData.skills, ''],
    }));
  };

  const handleRemoveEducation = (index) => {
    setFormData((prevData) => {
      const updatedEducation = prevData.education.filter((_, i) => i !== index);
      return { ...prevData, education: updatedEducation };
    });
  };

  const handleRemoveExperience = (index) => {
    setFormData((prevData) => {
      const updatedExperience = prevData.experience.filter((_, i) => i !== index);
      return { ...prevData, experience: updatedExperience };
    });
  };

  const handleRemoveSkill = (index) => {
    setFormData((prevData) => {
      const updatedSkills = prevData.skills.filter((_, i) => i !== index);
      return { ...prevData, skills: updatedSkills };
    });
  };

  const showData = () => {
    if (modified) {
      setShowOutput(true); // Show output if modified
    } else {
      alert('Please make some changes before generating the output.');
    }
  };

  const nextSection = () => {
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      setActiveSection(nextSection);
    }
  };

  const previousSection = () => {
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex > 0) {
      const prevSection = sections[currentIndex - 1];
      setActiveSection(prevSection);
    }
  };

  // Using useEffect to trigger scroll when activeSection changes
  useEffect(() => {
    const sectionRef = sectionRefs.current[activeSection];
    if (sectionRef) {
      sectionRef.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [activeSection]); // Dependency on activeSection

  return (
    <div>
      <div className="min-h-screen bg-black text-gray-300">
        {/* Top Navigation */}
        <nav className="bg-black border-b border-green-500 border-opacity-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Terminal className="w-6 h-6  text-green-500 mr-2" />
                <span className="text-2xl sm:text-base font-bold text-white">
                  Cyber<span className="text-green-500">Resume</span>
                </span>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="col-span-3">
              <div className="bg-gray-900 rounded-xl p-4 shadow-lg mb-6 border border-green-500 border-opacity-20">
                <div className="flex justify-center mb-6">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center border-2 border-green-500 border-opacity-50">
                      <Camera className="w-8 h-8 text-green-500" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <input
                        onChange={handleChange}
                        className="text-green-400 text-xs mt-10 ml-36"
                        name="image"
                        id="image"
                        type="file"
                        accept="image/*"
                        required
                      />
                    </div>
                  </div>
                </div>
                <input
                  value={formData.name}
                  onChange={handleChange}
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  className="w-full text-center text-lg font-bold mb-2 bg-transparent text-white border-none focus:ring-1 focus:ring-green-500 rounded-lg"
                />
                <input
                  value={formData.title}
                  onChange={handleChange}
                  name="title"
                  type="text"
                  placeholder="Your Title"
                  className="w-full text-center text-sm text-gray-400 bg-transparent border-none focus:ring-1 focus:ring-green-500 rounded-lg"
                />
              </div>

              <div className="space-y-2 p-4 bg-gray-900 rounded-xl border border-green-500 border-opacity-20">
                {sections.map((section) => (
                  <NavItem
                    key={section}
                    icon={
                      section === 'personal'
                        ? User
                        : section === 'experience'
                        ? Briefcase
                        : section === 'education'
                        ? GraduationCap
                        : section === 'skills'
                        ? Code
                        : Plus
                    }
                    label={section.charAt(0).toUpperCase() + section.slice(1)}
                    section={section}
                    setActiveSection={setActiveSection}
                    activeSection={activeSection}
                  />
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-9 space-y-6">
              {/* Add all your sections like personal, experience, education, and skills here */}

              {/* Show Next and Previous Button */}
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={previousSection}
                  className="text-green-500 hover:text-green-700 text-sm flex items-center gap-2"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Previous Section
                </button>
                <button
                  onClick={nextSection}
                  className="text-green-500 hover:text-green-700 text-sm flex items-center gap-2"
                >
                  Next Section
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Show Data Button */}
              <button
                onClick={showData}
                className="mt-8 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg text-lg"
              >
                Show Resume Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Preview */}
      {showOutput && (
        <ResumePreview formData={formData} />
      )}
    </div>
  );
};

export default CyberResumeBuilder;
