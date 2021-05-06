import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MovieCard.css';

function MovieCard(props) {
    const [btn, setBtn] = useState(undefined);

    const save = (event) => {
        event.preventDefault();

        if (props.data === null) {
            alert("You have to be logged in to use this feature");
            return;
        }

        axios({
            url: '/save',
            method: 'POST',
            data: { movie: props.movie }
        })
            .then(res => console.log(res.data))
            .catch((err) => {
                if (err.response && err.response.status === 403)
                    alert("You need to be logged in to use this feature") 
                else
                    console.log(err);
            });
    };

    const remove = (event) => {
        event.preventDefault();

        axios({
            url: '/remove',
            method: 'POST',
            data: { movie: props.movie }
        }).then((res) => {
                if(props.areFav) {
                    let left = props.movies.slice(0, props.rendered);
                    let right = props.movies.slice(props.rendered + 1);

                    props.setRendered((0 > props.rendered - 1) ? 0 : props.rendered - 1);
                    props.setMovies(left.concat(right));
                }
            })
            .catch(err => {
                if (err.response && err.response.status === 403)
                    console.log("ERROR - Tried to remove from favourites without being logged in");
                else
                    console.log(err);
            });
    };

    useEffect(() => {
        const checkIfFavourite = (movie) => {
            const compareMovies = (movie1, movie2) => {
                return JSON.stringify(movie1) === JSON.stringify(movie2);
            }
            return(
                axios({
                    url: '/favourites',
                    method: 'GET'
                }).then(res => {
                    for (let i = 0; i < res.data.length; ++i) {
                        if (compareMovies(res.data[i], movie))    
                            return true;
                    }
    
                    return false;
                })
                .catch(err => console.log(err))
            );
        }

        checkIfFavourite(props.movie).then(isFavourite => {
            if (isFavourite)
                setBtn(<form onSubmit={remove}>
                    <button className="button" type="submit">Remove from favourites</button>
                </form>);
            else
                setBtn(<form onSubmit={save}>
                    <button className="button" type="submit">Add to favourites</button>
                </form>);
        });
    });

    return (
        <div className="card">
            <img 
                className="card-image"
                src={`https://image.tmdb.org/t/p/w185_and_h278_bestv2/${props.movie.poster_path}`}
                alt={props.movie.title + ' poster'} 
            />
            <div className="card-content">
                <h3 className="card-title">{props.movie.title}</h3>
                <p><small>RELEASE DATE: {props.movie.release_date}</small></p>
                <p><small>RATING: {props.movie.vote_average}</small></p>
                <p className="card-desc">{props.movie.overview}</p>
                {btn}
            </div>
        </div>
    );
}

export default MovieCard;