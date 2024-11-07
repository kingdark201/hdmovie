import React, { memo } from 'react';
import Header from '../header';
import Footer from '../footer';
import './style.scss'

const MasterLayout = ({ children, ...props }) => {
    return (
        <div {...props}>
            <Header />
            <div className='all'>
                {children}
            </div>
            <Footer />
        </div>
    )
}


export default memo(MasterLayout);
