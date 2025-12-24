import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Easy Application',
      description: 'Simple and intuitive application process with step-by-step guidance.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: 'Quick Review',
      description: 'Fast and efficient application review process by our dedicated team.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Transparent Process',
      description: 'Track your application status in real-time with complete transparency.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="hero min-h-[80vh] bg-base-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold leading-tight mb-8"
              {...fadeIn}
            >
              Your Gateway to{' '}
              <span className="text-primary">Quality Education</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-base-content/70 mb-8"
              {...fadeIn}
              transition={{ delay: 0.2 }}
            >
              Streamline your educational journey with our comprehensive admission and enrollment management system.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              {...fadeIn}
              transition={{ delay: 0.4 }}
            >
              <Link 
                to="/programs" 
                className="btn btn-primary btn-lg"
              >
                Explore Programs
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                to="/register" 
                className="btn btn-ghost btn-lg"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <motion.div 
          className="container mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose AdmitFlow?</h2>
            <p className="text-base-content/60 max-w-2xl mx-auto">
              We make the admission process simple, efficient, and transparent for everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
              >
                <div className="card-body items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="card-title">{feature.title}</h3>
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="bg-primary text-primary-content py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-primary-content/80 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have already chosen AdmitFlow for their educational journey.
          </p>
          <Link 
            to="/register" 
            className="btn btn-secondary btn-lg"
          >
            Create Your Account
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;