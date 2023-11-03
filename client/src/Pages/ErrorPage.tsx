import React from 'react';
import { ReactComponent as ErrorSvg } from '../assets/404.svg';

const ErrorPage: React.FC = () => {
    return (
        <div className="h-screen w-[24rem] md:w-[35rem] lg:w-[60rem] flex justify-center items-center mx-auto overflow-hidden">
            <ErrorSvg />
        </div>
    );
};

export default ErrorPage;
