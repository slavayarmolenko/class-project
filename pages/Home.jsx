
import React from 'react';
import styles from './Home.module.scss';
import {URLs} from '../utils/URLs.js';

class Home extends React.Component {
    
    render() {
        const projects = [
            { 
                id: 'attorneys',
                title: 'Attorney Database',
                subtitle: 'Low-cost and Pro-Bono Legal Services',
                link: URLs.pages.ATTORNEYS,
                image: "/css/images/attorneydatabase.jpg",
                text: 'Database of California attorneys willing to provide free or low cost legal services to undocumented students and/or their families.'
            },
            {
                id:'legal_fund',
                title: 'Legal Fund',
                subtitle: 'Support Families in Crisis',
                link: '#',
                image: "/css/images/legalfund.jpg",
                text: 'An emergency fund to be used for legal services and fees by undocumented students and/or their families.'
            },
            {
                id: 'HIEROGLYPHS',
                title: 'HIEROGLYPHS',
                subtitle: 'Opportunities Beyond the Classroom',
                link: URLs.pages.HIEROGLYPHS,
                image: "/css/images/hieroglyphs.jpg",
                text: 'scHolarships, Internships, Externships, Research Opportunities, Grants, and Local Youth Programs for High Schoolers'
            },
            {
                id: 'scholarship_fund',
                title: 'Scholarship Fund',
                subtitle: 'Stipends for Students',
                link: '#',
                image: "/css/images/scholarshipfund.jpg",
                text: 'A scholarship fund to award stipends to students participating in our HIEROGLYPHS program and/or other established unpaid projects, to offset opportunity cost of a paid job.'
            },
            {
                id: 'dream_talks',
                title: 'DREAM Talks',
                subtitle: 'Starting a Conversation on Campus',
                link: '#',
                image: "/css/images/dreamtalks.jpg",
                text: 'Assemblies across high schools and college campuses in California to raise awareness about DREAM Act and DACA reinstatement.'
            },
            {
                id: 'dream_together',
                title: 'DREAM Together',
                subtitle: 'Advocacy and Activism',
                link: '#',
                image: "/css/images/dreamtogether.jpg", 
                text: 'Assemblies across high schools and college campuses in California to raise awareness about DREAM Act and DACA reinstatement.'
            } 
        ];
        
        return (
            <div className="home">
                <div className="banner">
                    <img width="1350" src="/css/images/banner.jpg" className="attachment-benevolent-slider size-benevolent-slider wp-post-image" alt="" itemProp="image" srcSet="/css/images/banner.jpg" sizes="(max-width: 1350px) 100vw, 1350px"></img>
                </div>
                <section className={styles.intro}>
                    <div className="container">
                        <header className={styles.header}>
                            <h2 className={styles.mainTitle}>According to PPIC, California is home to over 10 million immigrants. 1 in 4 of those are undocumented.</h2>
                            <p>We join together to support our peers whose immigrant status and future may be at risk.</p>
                        </header>
                        <div className={styles.row}>
                            <div className={styles.columns3}>
                                <div className={styles.imgHolder}>
                                    <img src="/css/images/home/cropped-img2-2-1.jpg" alt="Support CLASS"/>
                                </div>
                                <div className={styles.iconHolder}>
                                    <img src="/css/images/home/icon1-1-2.png" alt="Support CLASS" />
                                </div>
                                <div className={styles.textHolder}>
                                    <strong className={styles.title}>Support CLASS</strong>
                                    <a className={styles.btn} href={URLs.pages.DONATE}>Donate &gt;</a>
                                </div>
                            </div>
                            <div className={styles.columns3}>
                                <div className={styles.imgHolder}>
                                    <img src="/css/images/home/img3-2.jpg" alt="Seek Legal Assistance" />
                                </div>
                                <div className={styles.iconHolder}>
                                    <img src="/css/images/home/icon2-2.png" alt="Seek Legal Assistance" />
                                </div>
                                <div className={styles.textHolder}>
                                    <strong className={styles.title}>Seek Legal Assistance</strong>
                                    <a className={styles.btn} href={URLs.pages.ATTORNEYS}>Find an Attorney &gt;</a>
                                </div>
                            </div>
                            <div className={styles.columns3}>
                                <div className={styles.imgHolder}>
                                    <img src="/css/images/home/img4-2.jpg" alt="Join Our Cause" />
                                </div>
                                <div className={styles.iconHolder}>
                                    <img src="/css/images/home/icon3-2.png" alt="Join Our Cause" />
                                </div>
                                <div className={styles.textHolder}>
                                    <strong className={styles.title}>Join Our Cause</strong>
                                    <a className={styles.btn} href={URLs.pages.VOLONTEERS}>Volunteer &gt;</a>
                                </div>
                            </div>  
                        </div>
                            
                            
                    </div>
                </section>
                <section className={styles.ourProjects}>
                    <header className={styles.header}>
                        <h2 className={styles.mainTitle}>Our Projects</h2>
                    </header>
                    <ul className={styles.projectHolder}>
                        {projects.map(project => (
                        <li className={styles.columns2} key={project.id}>
                            <img width="960" height="450" 
                                src={project.image} 
                                alt="" itemProp="image" srcSet={project.image}
                                sizes="(max-width: 960px) 100vw, 960px" />
                            <div className={styles.textHolder}>
                                <div className={styles.alignCenter}>
                                    <strong className={styles.title}>{project.title}</strong>
                                    <p>{project.subtitle}</p>
                                </div>
                            </div>
                            <div className={styles.hoverState}>
                                <div className={styles.alignCenter}>
                                    <strong className={styles.title}>{project.title}</strong>
                                    <p>{project.subtitle}</p>
                                    <div className={styles.btnHolder}>
                                        <a href={project.link}><svg aria-hidden="true" data-prefix="fa" data-icon="angle-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" data-fa-i2svg=""><path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path></svg></a>
                                    </div>
                                    <div className={styles.textContent}>
                                    <p>{project.text}</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                        ))}
                    </ul>
                </section>
            </div>


        );
    }
}
export default Home;