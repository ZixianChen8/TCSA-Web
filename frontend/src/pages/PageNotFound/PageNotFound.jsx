import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Footer from '@/components/Footer/Footer.jsx';
import styles from './PageNotFound.module.css';

const PageNotFound = () => (
  <main id="main-content" className={styles.page}>
    <Helmet>
      <title>Page not found - TCSA</title>
    </Helmet>
    <div className={styles.content}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.lead}>
        The page you are looking for does not exist or may have moved.
      </p>
      <Link to="/" className={styles.link}>Back to home</Link>
    </div>
    <Footer />
  </main>
);

export default PageNotFound;
