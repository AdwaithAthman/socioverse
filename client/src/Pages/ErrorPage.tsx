import React from 'react';
import { ReactComponent as ErrorSvg } from '../assets/404.svg';

const ErrorPage: React.FC = () => {
    return (
        <div className="h-screen w-full flex justify-center items-center">
            <ErrorSvg />
        </div>
    );
};

export default ErrorPage;
