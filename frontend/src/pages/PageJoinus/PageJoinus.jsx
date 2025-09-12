import { useRef, useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
import axios from 'axios';
import CardJob from '@/components/CardJob/CardJob.jsx';
// import CardBenefit from '@/components/CardBenefit/CardBenefit.jsx';

import Navbar from "@/components/Navbar/Navbar.jsx"
import SecHero2 from "@/components/SecHero2/SecHero2.jsx"
import Footer from '@/components/Footer/Footer.jsx'
import SubmitBtn from '@/components/BtnStar2/BtnStar2.jsx'

import { Helmet } from 'react-helmet';

// import { FaLock } from 'react-icons/fa';

import styles from "./PageJoinus.module.css"

// Helper to parse a date string as a local date to avoid UTC shift
const parseLocalDate = (isoDate) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
};



const PageJoinus = () => {
    const [benefitImages, setBenefitImages] = useState([]);
    const [bgLoading, setBgLoading] = useState(true);
    const [bgError, setBgError] = useState(null);
    const [heroImage, setHeroImage] = useState('');
    const [positions, setPositions] = useState([]);
    const [posLoading, setPosLoading] = useState(true);
    const [posError, setPosError] = useState(null);

    useEffect(() => {
      const fetchBenefitImages = async () => {
        setBgLoading(true);
        setBgError(null);
        try {
          const { data } = await axios.get('/api/benefitBgImages/');
          setBenefitImages(data);
        } catch (err) {
          console.error("Failed to fetch benefit background images:", err);
          setBgError("Failed to load background images");
        } finally {
          setBgLoading(false);
        }
      };
      fetchBenefitImages();
    }, []);

    useEffect(() => {
      const fetchHeroImage = async () => {
        try {
          const res = await axios.get('/api/joinUsHeroImage/');
          if (Array.isArray(res.data) && res.data.length > 0) {
            setHeroImage(res.data[0].image);
          }
        } catch (err) {
          console.error('Error fetching join-us hero image:', err);
        }
      };
      fetchHeroImage();
    }, []);

    useEffect(() => {
      const fetchPositions = async () => {
        setPosLoading(true);
        setPosError(null);
        try {
          const { data } = await axios.get('/api/openPositions/');
          setPositions(data);
        } catch (err) {
          console.error('Error fetching open positions:', err);
          setPosError('Failed to load positions');
        } finally {
          setPosLoading(false);
        }
      };
      fetchPositions();
    }, []);

    // const placeholderText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.";

    const image1 = benefitImages[0]?.image || "https://via.placeholder.com/400x300/E0E0E0/B0B0B0?text=Image+1";
    const image2 = benefitImages[1]?.image || "https://via.placeholder.com/400x300/D8D8D8/A8A8A8?text=Image+2";
    const image3 = benefitImages[2]?.image || "https://via.placeholder.com/400x300/C0C0C0/909090?text=Image+3";
    const image4 = benefitImages[3]?.image || "https://via.placeholder.com/400x300/B8B8B8/888888?text=Image+4";
    const image5 = benefitImages[4]?.image || "https://via.placeholder.com/400x300/A8A8A8/787878?text=Image+5";

    const form = useRef();

    const sendEmail = (e) => {
      e.preventDefault();
      // Ask user to confirm submission
      if (!window.confirm("Are you sure you want to submit your application?")) {
          return; // user cancelled
      }
      // Capture applicant data before sending
      const applicantName = form.current['applicant_name'].value;
      const applicantEmail = form.current['applicant_email'].value;
      const positionApplied = form.current['position'].value;

      emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_JOB_APPLICATION_ADMIN_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          // Notify admin succeeded, now send auto-reply to applicant
          emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_JOB_APPLICATION_APPLICANT_TEMPLATE_ID,
            {
              applicant_name: applicantName,
              applicant_email: applicantEmail,
              position: positionApplied,
            }
          )
          .then(
            () => {
              alert('Your application has been submitted. You should receive a confirmation email shortly.');
              form.current.reset();
            },
            (error) => {
              console.error('Applicant auto-reply error:', error);
              alert('Application sent but failed to send confirmation email.');
            }
          );
        },
        (error) => {
          alert('Failed to send application. Please try again later.');
          console.error('Error:', error);
        }
      );
    };

    return (

        <main>
            <Helmet>
              <title>Join Our Team - TCSA</title>
            </Helmet>
            <header>
                <SecHero2
                title="BECOME A MEMBER OF TCSA"
                subtitle="Unlock Your Potential — Join the TCSA Family"
                image={heroImage}
                />
            </header>

            <div className={styles.content}>
                <section className={styles.benefitsSection}>
                    {bgLoading && <p>Loading benefits...</p>}
                    {bgError && <p className={styles.error}>{bgError}</p>}
                    {!bgLoading && !bgError && (
                      <>
                        {/* Benefit 1 */}
                        <div className={styles.benefitItem}>
                          <div className={styles.benefitTextContainer}>
                            <h2>Officially Recognized Volunteer Hours</h2>
                            <p>
                              As a member of TelferCSA, you will receive officially recognized volunteer hours. These hours can strengthen your scholarship and bursary applications while showcasing your active participation and sense of social responsibility. Whether you plan to pursue graduate studies or enter the job market, this recognition will set you apart.<br /><br />
                              作为 TelferCSA 的成员，你将获得学校官方认可的志愿者时数。这些时数不仅可以作为奖学金、助学金申请的重要加分项，也能体现你在校园生活中的积极参与和社会责任感。无论是未来的研究生申请，还是职业发展，这份记录都将为你增添竞争力。
                            </p>
                          </div>
                          <div className={styles.benefitImageContainer}>
                            <img src={image1} alt="Recognized volunteer hours" className={styles.benefitImage} />
                          </div>
                        </div>
                        {/* Benefit 2 */}
                        <div className={`${styles.benefitItem} ${styles.reverseOrder}`}>
                          <div className={styles.benefitTextContainer}>
                            <h2>Internship Certificate from a Federally Registered Canadian Company</h2>
                            <p>
                              By joining TelferCSA, you can obtain an internship certificate issued by a federally registered Canadian company. This is not just a participation record, but a legitimate experience that can be added to your resume. For international students without local experience, this certificate serves as a powerful entry point into the Canadian job market.<br /><br />
                              加入 TelferCSA 后，你将有机会获得由加拿大联邦注册公司开具的实习证明。这不仅是一份普通的社团参与记录，而是能写进简历的“实习经历”。对于缺乏本地经验的国际学生来说，这是一份难得的职场入门通行证。
                            </p>
                          </div>
                          <div className={styles.benefitImageContainer}>
                            <img src={image2} alt="Internship certificate" className={styles.benefitImage} />
                          </div>
                        </div>
                        {/* Benefit 3 */}
                        <div className={styles.benefitItem}>
                          <div className={styles.benefitTextContainer}>
                            <h2>Hands-On Project Experience in a Realistic Work Environment</h2>
                            <p>
                              At TelferCSA, you will engage in real projects, from sponsorship negotiations and marketing campaigns to event planning and media operations. These experiences mirror a professional workplace, training you in cross-team collaboration, resource management, and problem-solving. This practical exposure equips you to thrive in internships and future career opportunities.<br /><br />
                              在 TelferCSA，你不会只是完成例行任务，而是会参与到完整的项目流程中：赞助洽谈、市场推广、活动策划、媒体运营等。这些经验能让你感受到真实的职场环境，学会跨部门协作、资源整合和危机处理。这样的训练能帮助你在未来实习或工作中迅速适应并展现实力。
                            </p>
                          </div>
                          <div className={styles.benefitImageContainer}>
                            <img src={image3} alt="Hands-on project experience" className={styles.benefitImage} />
                          </div>
                        </div>
                        {/* Benefit 4 */}
                        <div className={`${styles.benefitItem} ${styles.reverseOrder}`}>
                          <div className={styles.benefitTextContainer}>
                            <h2>Development of Soft Skills and Leadership</h2>
                            <p>
                              TelferCSA helps you sharpen essential soft skills such as public speaking, cross-cultural communication, teamwork, and time management. Outstanding members may also take on leadership roles, gaining experience in decision-making and team management. These skills will give you a strong competitive edge in both your resume and interviews.<br /><br />
                              在这里，你将系统地锻炼公开演讲、跨文化沟通、团队协作和时间管理等关键软技能。如果表现优异，还将有机会担任部门骨干或管理层职位，直接参与战略决策与团队领导。这些经历会让你的简历与面试表现更具竞争力。
                            </p>
                          </div>
                          <div className={styles.benefitImageContainer}>
                            <img src={image4} alt="Soft skills and leadership" className={styles.benefitImage} />
                          </div>
                        </div>
                        {/* Benefit 5 */}
                        <div className={styles.benefitItem}>
                          <div className={styles.benefitTextContainer}>
                            <h2>Diverse Networking Opportunities</h2>
                            <p>
                              TelferCSA connects you with talented peers, cross-disciplinary collaborators, local businesses, alumni, and industry mentors. These networking opportunities not only support your academic journey but can also open doors for internships, job placements, entrepreneurship, and graduate studies.<br /><br />
                              TelferCSA 为你提供结识优秀同学、跨专业合作的机会，同时也让你与本地企业、校友及行业导师建立联系。这些人脉网络不仅能带来学业上的帮助，更可能成为你未来求职、创业或深造的重要资源。
                            </p>
                          </div>
                          <div className={styles.benefitImageContainer}>
                            <img src={image5} alt="Networking opportunities" className={styles.benefitImage} />
                          </div>
                        </div>
                      </>
                    )}
                </section>

                <section className={styles.jobSection}>
                    <h2 className={styles.heading}>Available Positions</h2>
                    <div className={styles.jobGrid}>
                        {posLoading && <p>Loading positions...</p>}
                        {posError && <p className={styles.error}>{posError}</p>}
                        {!posLoading && !posError && positions.map((pos) => (
                          <CardJob
                            key={pos.id}
                            title={pos.title}
                            description={pos.description}
                            postedAt={parseLocalDate(pos.posted_at)}
                          />
                        ))}
                    </div>
                </section>

                <section className={styles.howToApply}>
                    <h2>Fill this form to apply !</h2>


                    <div className={styles.applicationContent}>
                        <div className={styles.applicationDescription}>
                            <p>To apply, please enter your information and attach your resume.</p>
                        </div>

                        <form ref={form} onSubmit={sendEmail} encType="multipart/form-data" className={styles.applicationForm}>
                            <label>Name</label>
                            <input type="text" name="applicant_name" required />

                            <label>Email</label>
                            <input type="email" name="applicant_email" required />

                            <label>Title of the position</label>
                            <input type="text" name="position" required />

                            <label>Upload Resume</label>
                            <input type="file" name="resume_file" required />

                            {/* <label>Anything else we should know?</label>
                            <textarea name="message" rows="5" required></textarea> */}
                            <div className={styles.submitBtn}>
                              <SubmitBtn title="Submit" />
                            </div>

                        </form>

                    </div>

                </section>


            </div>
            {/* Footer */}
            <Footer />
        </main>

    )
};

export default PageJoinus;
