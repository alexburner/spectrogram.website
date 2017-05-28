import * as React from 'react';

interface Props {
    color?:{
        back?:string;
        fore?:string;
    };
    opacity?:number;
}

export default ({color={}, opacity=1}:Props) => (
    <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        backgroundColor: color.back || 'transparent',
        opacity: opacity,
    }}>
        <div style={{
            position: 'relative',
            top: '50%',
            transform: `
                translateY(-50%)
                perspective(1px)
            `,
            margin: 'auto',
            textAlign: 'center',
        }}>
            <i
                className="material-icons rotating"
                style={{
                    fontSize: '64px',
                    color: color.fore || 'white',
                }}
            >cached</i>
        </div>
    </div>
);
