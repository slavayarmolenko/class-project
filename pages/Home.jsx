
import React from 'react';
import styles from './Home.module.scss';
import {URLs} from '../utils/URLs.js';

class Home extends React.Component {
    render() {

        console.log('render home');
        return (
            <div className="home">
                <div className="banner">
                    <img width="1350" src="https://demo.raratheme.com/benevolent/wp-content/uploads/sites/19/2016/05/enthusiastic-children-876543-2.jpg" className="attachment-benevolent-slider size-benevolent-slider wp-post-image" alt="" itemProp="image" srcSet="https://demo.raratheme.com/benevolent/wp-content/uploads/sites/19/2016/05/enthusiastic-children-876543-2.jpg 1350w, https://demo.raratheme.com/benevolent/wp-content/uploads/sites/19/2016/05/enthusiastic-children-876543-2-300x151.jpg 300w, https://demo.raratheme.com/benevolent/wp-content/uploads/sites/19/2016/05/enthusiastic-children-876543-2-768x387.jpg 768w, https://demo.raratheme.com/benevolent/wp-content/uploads/sites/19/2016/05/enthusiastic-children-876543-2-1024x516.jpg 1024w" sizes="(max-width: 1350px) 100vw, 1350px"></img>
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
            </div>


        );
    }
}
export default Home;