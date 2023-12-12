import React from 'react';
import common from '../Constants/common';

const ErrorPage: React.FC = () => {
    return (
        <div className="h-screen w-[24rem] md:w-[35rem] lg:w-[60rem] flex justify-center items-center mx-auto overflow-hidden">
            <img src={common.ERROR_NOT_FOUND_SVG} alt="404 error svg" className='w-full h-full' />
        </div>
    );
};

export default ErrorPage;
