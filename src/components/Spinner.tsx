import * as React from 'react';

interface Props {
    color:{
        back:string;
        fore:string;
    };
    opacity?:number;
}

export default ({color, opacity=0.8}:Props) => (
    <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        backgroundColor: color.back,
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
                    color: color.fore,
                }}
            >cached</i>
        </div>
    </div>
);
