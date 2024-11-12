
import React, { useRef } from 'react';
import Image from 'next/image';
import { useEffect, useState } from 'react';



interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  image: File | null;
  professionalsummary: string;
  experience: Array<{
    position: string;
    companyname: string;
   
    jobdescription: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  skills: string[];
}

interface ResumePreviewProps {
  data: ResumeData;
}
  
const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {

  console.log("checking data for image",data)
  const resumeRef = useRef<HTMLDivElement | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');

  useEffect(() => {
    
       if (data?.image && data.image instanceof File) {
      const url = URL.createObjectURL(data.image);
      setProfileImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else{
      console.warn("Invalid Image",data?.image);
    }
  }
  , [data?.image]);

  const printResume = () => {

    if (resumeRef.current) {
    const printWindow = window.open('', '', 'height=600,width=800');
    const content = resumeRef.current.innerHTML;

    if (printWindow) { // Ensure printWindow is not null
    printWindow.document.write('<html><head><title>Resume</title>');
    printWindow.document.write('<style>body{font-family: Arial, sans-serif; margin: 18px;}');
    printWindow.document.write('.resume-wrapper{max-width: 600px; margin: 0 auto;}');
    printWindow.document.write('h1, h2, h3, h4{font-weight: bold; color: #4CAF50;}');
    printWindow.document.write('p{font-size: 14px;}');
    printWindow.document.write('@media print {body{font-size: 14px;}}'); // Optional: Styling for print
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');

    printWindow.document.close(); // Close the document to trigger the render
    printWindow.print();
    }else{
      console.error('failed to open print')
    } // Trigger the print dialog
    }
  };


 

  return (
    <div>
    <div ref={resumeRef} className="max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-2xl flex flex-col sm:flex-row">

      {/* Left Sidebar (Contact Information) */}
      <div className="w-full sm:w-1/3 bg-gradient-to-tl from-indigo-500 to-purple-600 p-6 rounded-l-xl flex flex-col items-center text-white">
        {/* Profile Image */}
        {profileImageUrl?(
        <Image
          width={200}
          height={200}
          src={profileImageUrl}
          alt="Profile"
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-xl mb-4"
          />):(
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gray-300 mb-4" />
          )}
        

        {/* Name and Title */}
        <h1 className="text-3xl sm:text-justify font-extrabold text-white mb-2">{data.name}</h1>
        <p className="text-lg font-medium mb-2">{data.title}</p>

        {/* Contact Info */}
        <div className="space-y-4 w-full text-center">
          <div className="flex justify-center items-center space-x-2">
            <a href={`mailto:${data.email}`} className="text-white">
              {data.email}
            </a>
          </div>
          <div className="flex justify-center items-center space-x-2">
            <p className="text-lg font-medium mb-4">{data.phone}</p>
          </div>
        </div>
      </div>

      {/* Right Content Area (Experience, Skills, Education) */}
      <div className="w-full sm:w-2/3 bg-gray-50 p-4 sm:p-6 rounded-r-xl">
        {/* Professional Summary */}
        <section className="mb-4">
          <h2 className="text-3xl font-semibold text-indigo-600 mb-2">Professional Summary</h2>
          <p className="text-lg text-gray-600">{data.professionalsummary}</p>
        </section>

        {/* Work Experience Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-indigo-600 mb-2">Work Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="space-y-4 mb-4">
              <div className="p-4 bg-gray-50 rounded-lg shadow-md border border-indigo-200">
                <h3 className="text-2xl font-semibold text-gray-800">{exp.position}</h3>
               
                <ul className="list-disc list-inside text-gray-700 mt-2">
                  <li>{exp.jobdescription}</li>
                </ul>
              </div>
            </div>
          ))}
        </section>

        {/* Education Section */}
        <section className="mb-4">
          <h2 className="text-3xl font-semibold text-indigo-600 mb-2">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="space-y-4 mb-4">
              <div className="p-2 bg-gray-50 rounded-lg shadow-md border border-indigo-200">
                <h3 className="text-xl font-semibold text-gray-800">{edu.degree}</h3>
                <p className="text-lg text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">Graduated: {edu.year}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Skills Section */}
        <section className="mb-4">
          <h2 className="text-3xl font-semibold text-indigo-600 mb-2">Skills</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-indigo-100 py-2 px-2 rounded-full text-indigo-600 text-sm font-small"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>

    {/* Print and Download Buttons */}
    <div className="text-center mt-6">
      <button
        onClick={printResume}
        className="mt-8 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg mr-4">
        Print Resume
      </button>
     
    </div>
  </div>
);
};


export default ResumePreview;
