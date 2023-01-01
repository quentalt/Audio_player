import React, {useEffect, useState} from 'react';
import {gql, useQuery} from "@apollo/client";
import IconButton from '@mui/material/IconButton';
import SkipNextIcon from '@mui/icons-material/SkipNext'
import {PauseCircle, PlayCircle, SkipPreviousRounded,} from "@mui/icons-material";
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

export default function AudioPlayer() {

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [audio, setAudio] = useState(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [trackList, setTrackList] = useState([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

    const {loading, error, data} = useQuery(ALLTRACKS);


    useEffect(() => {
        if (data) {
            setTrackList(data.diffusionsOfShowByUrl.edges);
            setCurrentTrack(data.diffusionsOfShowByUrl.edges[0].node);
        }
    }
    , [data]);

    useEffect(() => {
        if (currentTrack) {
            setAudio(new Audio(currentTrack.podcastEpisode.url));
        }
    }

    , [currentTrack]);

    useEffect(() => {
        if (audio) {
            if (isPlaying) {
                audio.play();
            } else {
                audio.pause();
            }
        }
    }

    , [isPlaying]);

    useEffect(() => {
if (audio) {
            audio.addEventListener('timeupdate', () => {
                setProgress(audio.currentTime);
                setDuration(audio.duration);
            });
        }
    }

    , [audio]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    }

    const handleNextTrack = () => {
        if (currentTrackIndex < trackList.length - 1) {
            setCurrentTrackIndex(currentTrackIndex + 1);
            setCurrentTrack(trackList[currentTrackIndex + 1].node);
        }
    }

    const handlePrevTrack = () => {
        if (currentTrackIndex > 0) {
            setCurrentTrackIndex(currentTrackIndex - 1);
            setCurrentTrack(trackList[currentTrackIndex - 1].node);
        }
    }

    const handleProgress = (e) => {
        setProgress(e.target.value);
        audio.currentTime = e.target.value;
    }

    return (
        <div>
            {currentTrack && (
                <Card sx={{display: 'flex', width: '50%', margin: 'auto', marginTop: '20px'}}>
                    <CardMedia
                        component="img"
                        sx={{width: 151}}
                        image="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/France_Culture_logo_2021.svg/800px-France_Culture_logo_2021.svg.png"
                        alt="France culture"
                    />
                    <Box sx={{display: 'flex', flexDirection:'column' , justifyContent: 'center', alignItems: 'center'}}>
                        <CardContent sx={{flex: '1 0 auto'}}>
                            <Typography component="div" variant="h5">
                                {currentTrack.podcastEpisode.title}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                 {currentTrack.published_date}
                            </Typography>
                        </CardContent>
                        <CardActions sx={{display: 'flex', justifyContent: 'space-between'}}>
                            <IconButton aria-label="previous" onClick={handlePrevTrack}>
                                <SkipPreviousRounded/>
                            </IconButton>
                            <IconButton aria-label="play/pause" onClick={handlePlayPause}>
                                {isPlaying ? <PauseCircle/> : <PlayCircle/>}
                            </IconButton>
                            <IconButton aria-label="next" onClick={handleNextTrack}>
                                <SkipNextIcon/>
                            </IconButton>
                            <input type="range" min={0} max={duration} value={progress} onChange={handleProgress}/>
                        </CardActions>
                    </Box>
                </Card>
            )}
        </div>
    );
}

