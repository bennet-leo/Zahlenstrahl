import Head from 'next/head';
import Image from 'next/image';
// import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';

const name = 'Bennet';
export const siteTitle = 'Next.js Sample Website';

function Layout({children}) {
    return ( 
        <div >
      
      <main>{children}</main>
    </div>
        );
}

export default Layout;