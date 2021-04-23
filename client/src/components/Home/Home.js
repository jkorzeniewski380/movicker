import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import MovieCard from '../MovieCard/MovieCard';
import './Home.css';

function Home({data}) {
    const [name, setName] = useState("");
    const [movies, setMovies] = useState([]);
    const [rendered, setRendered] = useState(0);
    const [showFav, setShowFav] = useState(false);
    

    useEffect(() => {
        const getPopular = async () => {
            const url = "https://api.themoviedb.org/3/movie/popular?api_key=200341856882729a54726055a4af051e&language=en-US";

            try {
                const res = await fetch(url);
                const data = await res.json();
    
                setMovies(data.results);
                setShowFav(false);
                setRendered(0);
            } catch (err) {
                console.log(err);
            }
        }

        if (movies.length === 0)
            getPopular();
    });

    const submit = async (event) => {
        event.preventDefault();
        
        if (name === "") {
            alert("No movie name found");
            return;
        }

        const url = `https://api.themoviedb.org/3/search/movie?api_key=200341856882729a54726055a4af051e&language=en-US&query=${name}&page=1&include_adult=false`;

        try {
            const res = await fetch(url);
            const data = await res.json();

            setMovies(data.results);
            setName("");
            setRendered(0);
            setShowFav(false);
        } catch (err) {
            console.log(err);
        }
    }

    const showFavourites = (data !== null) ? 
        <button 
            className="button"
            onClick={() => {
                axios({
                    url: '/favourites',
                    method: 'GET'
                }).then(res => {
                    if (res.data.length === 0) {
                        alert("No favourite movies found");
                    } else {
                        setMovies(res.data);
                        setShowFav(true);
                        setRendered(0);
                    }
                });
            }}>Show Favourites</button> :
        undefined;

    const moviesToRender = movies.filter(movie => movie.poster_path)
                         .map(movie => (
                            <MovieCard 
                                movie={movie} 
                                areFav={showFav}
                                movies={movies}
                                data={data}
                                rendered={rendered}
                                setRendered={setRendered}
                                setMovies={setMovies}
                                key={movie.id} />));

    let buttons = [];
    if (moviesToRender.length !== 0) {
        if (rendered !== 0)
            buttons[0] = (<button className="button" onClick={() => setRendered(rendered-1)}>Back</button>);

        if (rendered !== moviesToRender.length - 1)
            buttons[1] = (<button className="button" onClick={() => setRendered(rendered+1)}>Next</button>);
    }

    return (
        <div id="home-content">
            <div id="search">
                <form id="find-movie" onSubmit={submit}>
                    <label className="label" htmlFor="search">Movie Name</label>
                    <input
                        className="input"
                        type="text"
                        name="search"
                        placeholder="Enter movie name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <button className="button" type="submit">Search!</button>
                </form>
                {showFavourites}
            </div>
            <div id="movies">
                {moviesToRender[rendered]}
                <div id="buttons">
                    {buttons}
                </div>
            </div>
        </div>
    );
}

export default Home;