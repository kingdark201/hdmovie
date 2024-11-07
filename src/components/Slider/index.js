import React from 'react'
import CardFilm from '../CardFilm'
import './style.scss'

function Slider({ title, data, loading }) {
    return (
        <>
            <h4 className='title_slider'>{title}</h4>
            <div id='formList'>
                <div id='list'>
                    {loading ? (
                        <p className='text-center text-white'>Loading...</p>
                    ) : (
                        <>
                            {data.map((film, index) => (
                                <div className='item' key={index}>
                                    <CardFilm film={film} />
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default Slider
