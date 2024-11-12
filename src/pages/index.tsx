import React, { act, useEffect, useRef, useState } from 'react';
import { Camera, Terminal, GraduationCap, Briefcase, Code, User, Plus, Trash2, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Html } from 'next/document';

const ResumePreview = dynamic(() => import('./components/ResumePreview'), { 
  ssr: false 
});

interface ExperienceItem {
  companyname: string;
  position: string;
  jobdescription: string;
  
}

interface EducationItem {
  institution: string;
  degree: string;
  year: string;
  gpa: string;
}

interface FormData {
  name: string;
  email: string;
  title: string;
  phone: string;
  image: File | null;
  professionalsummary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
}

const CyberResumeBuilder: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('personal');
  // Declare the type for the refs object
const sectionRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({
  personal: React.createRef(),
  experience: React.createRef(),
  education: React.createRef(),
  skills: React.createRef()
});

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
    <button onClick={() => setActiveSection(section)} className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-300 ${
      activeSection === section
        ? 'bg-green-500 bg-opacity-20 text-green-400 border border-green-500'
        : 'hover:bg-green-500 hover:bg-opacity-10 text-gray-400 hover:text-green-400'}`}>
      <Icon className="w-5 h-5" />
      <span className="flex-1 text-left">{label}</span>
      <ChevronRight className={`w-4 h-4 transition-transform ${activeSection === section ? 'rotate-90' : ''}`} />
    </button>
  );

  const [formData, setFormData] = useState<FormData>({
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

  const [initialFormData]= useState(formData);
  const [modified, setModified] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  type FormDataValue = string | File | null | ExperienceItem[] | EducationItem[] | string[];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,sectionIndex?: number,  // Optional, should be a number when passed
    field?: 'experience' | 'education' | 'skills'  // Optional, specific fields
  ) => {
    let name:string;
    let value:string | File | null;

    if (e.target instanceof HTMLInputElement) {
      name = e.target.name;
      if (e.target.type === 'file' && e.target.files) {
        value = e.target.files[0];  // Save the selected image file
      } else {
        value = e.target.value;
      }
    } else if (e.target instanceof HTMLTextAreaElement) {
      name = e.target.name;
      value = e.target.value;
    } else {
      return;
    }

   

    setFormData((prevData) => {
      const updatedFormData:FormData = { ...prevData };
    
      if (sectionIndex !== undefined) {
        // Handle array fields (experience, education, skills)
        if (field === 'experience') {
          const updatedExperience = [...prevData.experience];
          updatedExperience[sectionIndex] = {
            ...updatedExperience[sectionIndex],
            [name]: value as string,
          };
          updatedFormData.experience = updatedExperience;
        } else if (field === 'education') {
          const updatedEducation = [...prevData.education];

          updatedEducation[sectionIndex] = {
            ...updatedEducation[sectionIndex],
            [name]: value as string,
          };
          updatedFormData.education = updatedEducation;
        } else if (field === 'skills') {
          const updatedSkills = [...prevData.skills];
          updatedSkills[sectionIndex] = value as string;
          updatedFormData.skills = updatedSkills;
        }
      } else if (e.target instanceof HTMLInputElement && e.target.type === 'file' && e.target.files) {
        updatedFormData.image = value as File | null;
      } 
       
      else {
        (updatedFormData[name as keyof FormData] as FormDataValue) = value as FormData[keyof FormData];
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

  const handleRemoveEducation = (index: number): void => {
    setFormData((prevData) => ({
      ...prevData,
      education: prevData.education.filter((_, i) => i !== index),
    }));
  };
  

  const handleRemoveExperience = (index: number): void => {
    setFormData((prevData) => ({
      ...prevData,
      experience: prevData.experience.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveSkill = (index: number): void => {
    setFormData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((_, i) => i !== index),
    }));
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
    sectionRefs.current[activeSection]?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [activeSection]);// Dependency on activeSection

  


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
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              
              
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
                    {/*below Camera tag is the logo of Camera appears with picture input*/}
                    <Camera className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <input onChange={handleChange}  className="text-green-400 text-xs mt-10 ml-36" name="image" id="image" type="file" accept="image/*" required/>
                  </div>
                </div>
              </div>
              <input
               value={formData.name} 
               onChange={handleChange} 
                name="name"
                type="text"
                placeholder="Your Name"
                className="w-full text-center text-lg font-bold mb-2 bg-transparent text-white border-none focus:ring-1 focus:ring-green-500 rounded-lg"/>
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
              <NavItem icon={User} label="Personal Info" section="personal" setActiveSection={setActiveSection} activeSection={activeSection} />
              <NavItem icon={Briefcase} label="Experience" section="experience" setActiveSection={setActiveSection} activeSection={activeSection}/>
              <NavItem icon={GraduationCap} label="Education" section="education"setActiveSection={setActiveSection} activeSection={activeSection} />
              <NavItem icon={Code} label="Skills" section="skills"setActiveSection={setActiveSection}  activeSection={activeSection}  />
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-green-500 border-opacity-20">
              {/* Personal Info Section */}
              {activeSection === 'personal' && (
                <div ref={sectionRefs.current.personal} className="space-y-6 animate-fade">
                  <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-2">
                    <User className="w-6 h-6" />
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm text-green-400">Email Address</label>
                      <input
                       value={formData.email} 
                       onChange={handleChange} 
                        name="email"
                        type="email"
                        className="w-full px-4 py-2 rounded-lg bg-black text-white border border-green-500 border-opacity-50 focus:border-green-400 focus:ring-1 focus:ring-green-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm text-green-400">Phone Number</label>
                      <input
                       value={formData.phone} 
                       onChange={handleChange} 
                        name="phone"
                        type="tel"
                        className="w-full px-4 py-2 rounded-lg bg-black text-white border border-green-500 border-opacity-50 focus:border-green-400 focus:ring-1 focus:ring-green-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm text-green-400">Professional Summary</label>
                    <textarea
                     value={formData.professionalsummary} 
                     onChange={handleChange} 
                    name="professionalsummary"
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg bg-black text-white border border-green-500 border-opacity-50 focus:border-green-400 focus:ring-1 focus:ring-green-400"
                    />
                  </div>
                  <button className="mt-8 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg" onClick={nextSection}>Next</button>
                </div>
              )}

              {/* Experience Section */}
              {activeSection === 'experience' && (
                <div ref={sectionRefs.current.experience} className="animate-fade">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
                      <Briefcase className="w-6 h-6" />
                      Work Experience
                    </h2>
                    <button onClick={handleAddExperience} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg transition-all duration-300">
                      <Plus className="w-5 h-5" />
                      Add Experience
                    </button>
                  </div>
                  
                  {formData.experience.map((exp,index)=>(
                  <div key={index} className="bg-black rounded-lg p-4 mb-4 border border-green-500 border-opacity-20">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                       value={exp.companyname} 
                       onChange={(e)=> handleChange(e,index, 'experience')} 
                        name="companyname"
                        placeholder="Company Name"
                        className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-green-500 border-opacity-50 focus:border-green-400 focus:ring-1 focus:ring-green-400"
                      />
                      <input
                       value={exp.position} 
                       onChange={(e)=>{handleChange(e,index,'experience')}} 
                        name="position"
                        placeholder="Position"
                        className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-green-500 border-opacity-50 focus:border-green-400 focus:ring-1 focus:ring-green-400"
                      />
                    </div>
                    <textarea
                     value={exp.jobdescription} 
                     onChange={(e)=>handleChange(e,index,'experience')} 
                    name="jobdescription"
                      placeholder="Job Description"
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-green-500 border-opacity-50 focus:border-green-400 focus:ring-1 focus:ring-green-400"
                    required/>
                    <button onClick={()=>{handleRemoveExperience(index)}}>
                    <Trash2 className="w-6 h-8 text-red-500 hover:text-red-400" />
                      </button>
                  </div>))}
                  <button className="mt-8 mr-2 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg"  onClick={PreviousSection}>Back</button>
                  <button className="mt-8 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg" onClick={nextSection}>Next</button>
                </div>
              )}
                
              {/* Education Section */}
              {activeSection === 'education' && (
                <div ref={sectionRefs.current.education} className="animate-fade">
                  <div className="flex justify-between items-center mb-6">
                    <h2  className="text-2xl font-bold text-green-400 flex items-center gap-2">
                      <GraduationCap className="w-6 h-6" />
                      Education
                    </h2>
                    <button onClick={handleAddEducation} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg transition-all duration-300">
                      <Plus className="w-5 h-5" />
                      Add Education
                    </button>
                  </div>
                  {formData.education.map((edu,index)=>(
                  <div key={index} className="bg-black rounded-lg p-4 border border-green-500 border-opacity-20">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                       value={edu.institution} 
                       onChange={(e)=>handleChange(e,index,'education')} 
                      name="institution"
                        placeholder="Institution"
                        className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-green-500 border-opacity-50 focus:border-green-400 focus:ring-1 focus:ring-green-400"
                      />
                      <input
                        value={edu.degree}
                            onChange={(e) => handleChange(e, index, 'education')}
                      name="degree"
                        placeholder="Degree"
                        className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-green-500 border-opacity-50 focus:border-green-400 focus:ring-1 focus:ring-green-400"
                      />
                      <input
                      value={edu.year}
                      onChange={(e) => handleChange(e, index, 'education')}
                      name="year"
                        placeholder="Year"
                        className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-green-500 border-opacity-50 focus:border-green-400 focus:ring-1 focus:ring-green-400"
                      />
                      <input
                        value={edu.gpa}
                        onChange={(e) => handleChange(e, index, 'education')}
                      name="gpa"
                        placeholder="GPA"
                        className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-green-500 border-opacity-50 focus:border-green-400 focus:ring-1 focus:ring-green-400"
                      />
                    </div>
                    <button onClick={()=>{handleRemoveEducation(index)}}>
                    <Trash2 className="w-6 h-8 text-red-500 hover:text-red-400" />
                    </button>
                  </div>))}
                  <button className="mt-8 mr-2 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg"  onClick={PreviousSection}>Back</button>
                  <button className="mt-8 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg" onClick={nextSection}>Next</button>
                </div>
              )}

              {/* Skills Section */}
              {activeSection === 'skills' && (
                <div   className="animate-fade">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
                      <Code className="w-6 h-6" />
                      Skills
                    </h2>
                    <button onClick={handleAddSkill} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg transition-all duration-300">
                      <Plus className="w-5 h-5" />
                      Add Skill
                    </button>
                  </div>
                {formData.skills.map((skill,index)=>(
                  <div key={index} className="grid grid-cols-3 gap-4">
                    <div className="bg-black rounded-lg p-4 border border-green-500 border-opacity-20 relative group">
                      <input
       
                       value={skill} 
                       onChange={(e)=>handleChange(e,index,'skills')} 
                      name="skills"
                        placeholder="Enter skill"
                        className="w-full bg-transparent border-none focus:ring-1 focus:ring-green-400 text-white rounded-lg"
                      />
                      
                      <button onClick={()=>{handleRemoveSkill(index)}}>
                        
                        <Trash2 className="w-4 h-4 text-red-500 hover:text-red-400" />
                      </button>
                    </div>
                    
                  </div>))}
                  <button className="mt-8 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg"  onClick={PreviousSection}>Back</button>
                  <button onClick={showData} className="mt-8 px-6 py-2 mx-40   bg-pink-600 text-black font-semibold rounded-lg">
                
                Generate Your Resume
              </button>
                </div>
              )}
                
            </div>
            
          </div>
         
        </div>
       
      </div>
      
     
    </div>

    {showOutput && <div className="py-4 bg-slate-600">
           <ResumePreview data={formData} />
           </div>}
    </div>
  );
};

export default CyberResumeBuilder;
