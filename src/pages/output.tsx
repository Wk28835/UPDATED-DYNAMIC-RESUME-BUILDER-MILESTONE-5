import React from 'react';

const ResumePreview = ({ data }) => {
    const profileImage = data?.image ? URL.createObjectURL(data.image) : null;

console.log("checking data",data)
  return (
    <div className="max-w-3xl mx-auto bg-white text-black p-8 rounded-lg shadow-lg border border-green-500">
      <div className="text-center mb-8">
       {profileImage && (
          <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
        {/* Name and Title */}
        <h1 className="text-4xl font-semibold text-green-500">{data.name}</h1>
        <h2 className="text-xl text-gray-600">{data.title}</h2>
      </div>

      {/* Contact Info */}
      <div className="flex justify-center gap-8 mb-8">
        <div className="text-center">
          <p className="text-lg font-semibold text-green-500">Email</p>
          <p>{data.email}</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-green-500">Phone</p>
          <p>{data.phone}</p>
        </div>
      </div>

      {/* Professional Summary */}
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-green-500 mb-4">Professional Summary</h3>
        <p className="text-lg text-gray-700">{data.professionalsummary}</p>
      </section>

      {/* Experience Section */}
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-green-500 mb-4">Work Experience</h3>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow-md border border-green-200">
            <h4 className="text-xl font-semibold text-green-600">{data.companyname}</h4>
            <h5 className="text-lg text-gray-500">{data.position}</h5>
            <p className="text-sm text-gray-600 mt-2">{data.jobdescription}</p>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-green-500 mb-4">Education</h3>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow-md border border-green-200">
            <h4 className="text-xl font-semibold text-green-600">{data.institution}</h4>
            <h5 className="text-lg text-gray-500">{data.degree}</h5>
            <p className="text-sm text-gray-600">Year of Graduation: {data.year}</p>
            <p className="text-sm text-gray-600">GPA: {data.gpa}</p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-green-500 mb-4">Skills</h3>
        <div className="grid grid-cols-3 gap-4">
          {data.skills.split(',').map((skill, index) => (
            <div key={index} className="bg-gray-800 text-white text-center py-2 px-4 rounded-lg shadow-md">
              {skill.trim()}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResumePreview;
