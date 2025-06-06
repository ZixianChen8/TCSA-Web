import Navbar from "@/components/Navbar/Navbar.jsx"
import SecHero2 from "@/components/SecHero2/SecHero2.jsx" 
import Footer from '@/components/Footer/Footer.jsx'

import CardMember from "@/components/CardMember/CardMember.jsx"

import Divider from '@mui/material/Divider';

import styles from "./PageOurTeam.module.css"

const PageOurTeam = () => {
    
    
    
    
    return (
        <main>
            <header>
                <SecHero2
                title="MEET THE ALUMNI "
                subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id nisl condimentum, volutpat dolor et, tincidunt tortor. Maecenas finibus est eu justo pulvinar blandit."
                />
            </header>
            <Divider> <h2 className={styles.sectionTitle}>Former Club Members</h2> </Divider>
            
            <section className={styles.FCM}>
                
                <CardMember type="former" />
                <CardMember type="former" />
                <CardMember type="former" />
                <CardMember type="former" />
                <CardMember type="former" />
                <CardMember type="former" />
                <CardMember type="former" />
                <CardMember type="former" />
                <CardMember type="former" />
            </section>
            
             <Divider> <h2 className={styles.sectionTitle}>Telfer Alumni</h2> </Divider>
            <section className={styles.TA}>

                <CardMember type="telfer" />
                <CardMember type="telfer" />
                <CardMember type="telfer" />
                <CardMember type="telfer" />
                <CardMember type="telfer" />
                <CardMember type="telfer" />
                <CardMember type="telfer" />
                <CardMember type="telfer" />
                <CardMember type="telfer" />
                <CardMember type="telfer" />
                <CardMember type="telfer" />
                <CardMember type="telfer" />
            </section>
            
            <Footer />

        </main>
        
    )
}
export default PageOurTeam;