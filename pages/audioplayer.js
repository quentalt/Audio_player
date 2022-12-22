import React, {useState} from 'react';
import {gql, useQuery} from "@apollo/client";
import IconButton from '@mui/material/IconButton';
import SkipNextIcon from '@mui/icons-material/SkipNext'
import {
    FastForward,
    FastRewind, PauseCircle, PlayCircle,
    SkipPreviousRounded,
} from "@mui/icons-material";
import {Box, Card, CardActions, CardContent, CardMedia, Typography} from "@mui/material";

const ALLTRACKS = gql`
        query audioData {
            diffusionsOfShowByUrl(url: "https://www.franceculture.fr/emissions/fictions-theatre-et-cie", first: 10) {
                edges {
                    cursor
                    node {
                        id
                        title
                        url
                        published_date
                        podcastEpisode {
                            url
                            title
                        }
                    }
                }
            }
        }
    `;
let diffusionsOfShowByUrl = [];
let currentTrack = diffusionsOfShowByUrl.edges[0].node[0];
diffusionsOfShowByUrl.edges[currentTrack].node.podcastEpisode = {
    url: "https://rf.proxycast.org/f8d28d03-ded8-4c0a-bf6d-02361c9c18e5/11498-18.12.2022-ITEMA_23231057-2022C11356E0040-21.mp3?project=7bc25dbd-751a-409a-b8f2-3fa11a1d3cbf",
    title: "Fictions - Théâtre et Cie - 22/07/2021"

}

export default function AudioPlayer() {

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
    const { loading, error, data } = useQuery(ALLTRACKS);




    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;



    const toggle = () => {
        setIsPlaying(!isPlaying);
    };
    const next = () => {
        setCurrentTrack(currentTrack + 1);
        setIsPlaying(true);
    };
    const previous = () => {
        setCurrentTrack(currentTrack - 1);
        setIsPlaying(true);
    };
    const handleSkipPrevious = () => {
        const currentIndex = currentTrack; // get current track index
        const newIndex = Math.max(0, currentIndex - 1); // get previous track index
        setCurrentTrack(newIndex); // set new track index
        setIsPlaying(true); // play new track
    };

    const handleSkipNext = () => {
        setCurrentTrack(currentTrack.valueOf() - 1);
        setIsPlaying(true);
    };
    /*const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    }

    */

    data.diffusionsOfShowByUrl = {
        edges: [
            {
                cursor: "YXJyYXljb25uZWN0aW9uOjA=",
                node: {
                    id: "RGlmdWd1c2lvbk9mU2hvdy0xMjM0NTY3ODk=",
                    title: "Fictions - Théâtre et Cie - 22/07/2021",
                    url: "https://www.franceculture.fr/emissions/fictions-theatre-et-cie/fictions-theatre-et-cie-22-07-2021",
                    published_date: "2021-07-22T00:00:00+00:00",
                    podcastEpisode: {
                        url: "https://rf.proxycast.org/f8d28d03-ded8-4c0a-bf6d-02361c9c18e5/11498-18.12.2022-ITEMA_23231057-2022C11356E0040-21.mp3?project=7bc25dbd-751a-409a-b8f2-3fa11a1d3cbf",
                        title: "Fictions - Théâtre et Cie - 22/07/2021"
                    }
                }
            },
            ],
    }

    let diffusionsOfShowByUrl = data.diffusionsOfShowByUrl;
    let podcastEpisode = diffusionsOfShowByUrl.edges[currentTrack].node.podcastEpisode;


    return data.diffusionsOfShowByUrl.edges.map(({node}) => (
            <div key={node.id}>
            <div>
                <Card sx={{display: 'flex'}}>
                    <Box sx={{display: 'flex', flexDirection: 'column'}}>
                        <CardContent sx={{flex: '1 0 auto'}}>
                            <Typography component="div" variant="h5">
                                {podcastEpisode.title}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {podcastEpisode.url}
                            </Typography>
                        </CardContent>
                        <CardActions>
                        <IconButton aria-label="skipprevious" onClick={handleSkipPrevious}>
                                {<FastRewind/>}
                            </IconButton>
                            <IconButton aria-label="previous" onClick={previous}>
                                {<SkipPreviousRounded/>}
                            </IconButton>
                         
                            <IconButton aria-label="play/pause" onClick={toggle}>
                                {isPlaying ? <PauseCircle/> : <PlayCircle/>}
                            </IconButton>
                            <IconButton aria-label="next" onClick={next}>
                                {<SkipNextIcon/>}
                            </IconButton>
                            <IconButton aria-label="skipnext" onClick={handleSkipNext}>
                                {<FastForward/>}
                            </IconButton>
                        </CardActions>
                    </Box>
                    <CardMedia
                        component="img"
                        sx={{width: 151}}
                        image="/static/images/cards/live-from-space.jpg"
                        alt="Live from space album cover"
                    />
                </Card>
            </div>

            <audio
                src={podcastEpisode.url}
                controls
                autoPlay={isPlaying}
                onEnded={next}
            />
        </div>
    ));

}


