import React, { useEffect, useRef, useState } from 'react';

import { Camera, Terminal, GraduationCap, Briefcase, Code, User, Plus, Trash2, ChevronRight } from 'lucide-react';
import ResumePreview from './components/ResumePreview';

const CyberResumeBuilder = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const sectionRefs = useRef({});
  const sections = ['personal', 'experience', 'education', 'skills'];

  // Define types for the props
  interface NavItemProps {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    section: string;
    setActiveSection: (section: string) => void;
    activeSection: string;
  }

  const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, section }) => (
    <button onClick={() => setActiveSection(section)} className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-300 ${
      activeSection === section
        ? 'bg-green-500 bg-opacity-20 text-green-400 border border-green-500'
        : 'hover:bg-green-500 hover:bg-opacity-10 text-gray-400 hover:text-green-400'}`}>
      <Icon className="w-5 h-5" />
      <span className="flex-1 text-left">{label}</span>
      <ChevronRight className={`w-4 h-4 transition-transform ${activeSection === section ? 'rotate-90' : ''}`} />
    </button>
  );

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, sectionIndex?: number, field?: 'experience' | 'education' | 'skills') => {
    const { name, value, type } = e.target;
    
    // Check if the input is of type "file"
    let files: FileList | undefined;
    if (type === 'file') {
      files = (e.target as HTMLInputElement).files;
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
        updatedFormData.image = files[0];  // Handle the image file
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
      alert("Please make some changes before generating the output.");
    }
  };

  const nextSection = () => {
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      setActiveSection(nextSection);
    }
  };

  const PreviousSection = () => {
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex > 0) {
      const nextSection = sections[currentIndex - 1];
      setActiveSection(nextSection);
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
  }, [activeSection]);

  return (
    <div>
      <div className="min-h-screen bg-black text-gray-300">
        {/* Top Navigation */}
        <nav className="bg-black border-b border-green-500 border-opacity-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Terminal className="w-6 h-6 text-green-500 mr-2" />
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
                      {/* Camera tag for file input */}
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

              <div className="space-y-2 p-4 bg-gray-900 rounded-xl shadow-lg border border-green-500 border-opacity-20">
                <NavItem icon={User} label="Personal Info" section="personal" />
                <NavItem icon={Briefcase} label="Experience" section="experience" />
                <NavItem icon={GraduationCap} label="Education" section="education" />
                <NavItem icon={Code} label="Skills" section="skills" />
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-9">
              {/* Personal Section */}
              {activeSection === 'personal' && (
                <div ref={(el) => (sectionRefs.current.personal = el)} className="space-y-4">
                  <h2 className="text-2xl text-white">Personal Information</h2>
                  <div className="flex gap-4">
                    <div className="w-full">
                      <input
                        value={formData.email}
                        onChange={handleChange}
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full text-sm p-3 bg-transparent text-white border-b focus:outline-none"
                      />
                    </div>
                    <div className="w-full">
                      <input
                        value={formData.phone}
                        onChange={handleChange}
                        name="phone"
                        type="tel"
                        placeholder="Phone"
                        className="w-full text-sm p-3 bg-transparent text-white border-b focus:outline-none"
                      />
                    </div>
                  </div>
                  <textarea
                    value={formData.professionalsummary}
                    onChange={handleChange}
                    name="professionalsummary"
                    placeholder="Professional Summary"
                    className="w-full h-24 p-3 bg-transparent text-white border-b focus:outline-none"
                  />
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={nextSection}
                      className="w-1/2 p-3 bg-green-500 text-white rounded-lg">
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Experience Section */}
              {activeSection === 'experience' && (
                <div ref={(el) => (sectionRefs.current.experience = el)} className="space-y-4">
                  <h2 className="text-2xl text-white">Experience</h2>
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg space-y-2">
                      <input
                        name="companyname"
                        type="text"
                        value={exp.companyname}
                        onChange={(e) => handleChange(e, index, 'experience')}
                        placeholder="Company Name"
                        className="w-full bg-transparent text-white border-b focus:outline-none"
                      />
                      <input
                        name="position"
                        type="text"
                        value={exp.position}
                        onChange={(e) => handleChange(e, index, 'experience')}
                        placeholder="Position"
                        className="w-full bg-transparent text-white border-b focus:outline-none"
                      />
                      <textarea
                        name="jobdescription"
                        value={exp.jobdescription}
                        onChange={(e) => handleChange(e, index, 'experience')}
                        placeholder="Job Description"
                        className="w-full bg-transparent text-white border-b focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleRemoveExperience(index)} className="text-red-500">
                          <Trash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button onClick={handleAddExperience} className="flex items-center gap-2 text-green-400">
                    <Plus />
                    Add Experience
                  </button>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={PreviousSection}
                      className="w-1/2 p-3 bg-gray-500 text-white rounded-lg">
                      Previous
                    </button>
                    <button
                      onClick={nextSection}
                      className="w-1/2 p-3 bg-green-500 text-white rounded-lg">
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Education Section */}
              {activeSection === 'education' && (
                <div ref={(el) => (sectionRefs.current.education = el)} className="space-y-4">
                  <h2 className="text-2xl text-white">Education</h2>
                  {formData.education.map((edu, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg space-y-2">
                      <input
                        name="institution"
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleChange(e, index, 'education')}
                        placeholder="Institution"
                        className="w-full bg-transparent text-white border-b focus:outline-none"
                      />
                      <input
                        name="degree"
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleChange(e, index, 'education')}
                        placeholder="Degree"
                        className="w-full bg-transparent text-white border-b focus:outline-none"
                      />
                      <input
                        name="year"
                        type="text"
                        value={edu.year}
                        onChange={(e) => handleChange(e, index, 'education')}
                        placeholder="Year"
                        className="w-full bg-transparent text-white border-b focus:outline-none"
                      />
                      <input
                        name="gpa"
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => handleChange(e, index, 'education')}
                        placeholder="GPA"
                        className="w-full bg-transparent text-white border-b focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleRemoveEducation(index)} className="text-red-500">
                          <Trash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button onClick={handleAddEducation} className="flex items-center gap-2 text-green-400">
                    <Plus />
                    Add Education
                  </button>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={PreviousSection}
                      className="w-1/2 p-3 bg-gray-500 text-white rounded-lg">
                      Previous
                    </button>
                    <button
                      onClick={nextSection}
                      className="w-1/2 p-3 bg-green-500 text-white rounded-lg">
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Skills Section */}
              {activeSection === 'skills' && (
                <div ref={(el) => (sectionRefs.current.skills = el)} className="space-y-4">
                  <h2 className="text-2xl text-white">Skills</h2>
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg space-y-2">
                      <input
                        name="skills"
                        type="text"
                        value={skill}
                        onChange={(e) => handleChange(e, index, 'skills')}
                        placeholder="Skill"
                        className="w-full bg-transparent text-white border-b focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleRemoveSkill(index)} className="text-red-500">
                          <Trash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button onClick={handleAddSkill} className="flex items-center gap-2 text-green-400">
                    <Plus />
                    Add Skill
                  </button>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={PreviousSection}
                      className="w-1/2 p-3 bg-gray-500 text-white rounded-lg">
                      Previous
                    </button>
                    <button
                      onClick={showData}
                      className="w-1/2 p-3 bg-green-500 text-white rounded-lg">
                      Generate Resume
                    </button>
                  </div>
                </div>
              )}

              {/* Resume Preview */}
              {showOutput && <ResumePreview formData={formData} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberResumeBuilder;
