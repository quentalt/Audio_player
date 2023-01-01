import React, {useEffect, useState} from 'react';
import {gql, useQuery} from "@apollo/client";
import IconButton from '@mui/material/IconButton';
import SkipNextIcon from '@mui/icons-material/SkipNext'
import {
    PauseCircle,
    PlayCircle,
    SkipPreviousRounded,
    SurroundSound,
    VolumeDown,
    VolumeMute, VolumeOff,
    VolumeUp,
} from "@mui/icons-material";
import {Box, Card, CardActions, CardContent, CardMedia, Slider, styled, Typography, useTheme} from "@mui/material";

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
    const [volume, setVolume] = useState(1);
    // const [position, setPosition] = useState(32);
   const theme = useTheme();
   function formatDuration(duration) {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration - minutes * 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }


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
    }, [currentTrack]);



    useEffect(() => {
        if (audio) {
            if (isPlaying) {
                audio.play();
            } else {
                audio.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        if (audio) {
            audio.addEventListener('timeupdate', () => {
                setProgress(audio.currentTime);
                setDuration(audio.duration);
            });
        }
    }, [audio]);

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

    const handleVolume = (e) => {
        setVolume(e.target.value);
        audio.volume = e.target.value;
    }

    const handleMute = () => {
        setVolume(0);
        audio.volume = 0;
    }

    /* Petit text */
    const TinyText = styled(Typography)({
        fontSize: '0.75rem',
        opacity: 0.38,
        fontWeight: 500,
        letterSpacing: 0.2,
    });




    return (
        <div>
            {currentTrack && (
                <Card sx={{display: 'flex', width: '50%', margin: 'auto', marginTop: '20px', borderRadius: '10px', boxShadow: 3}}>
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
                            {/*<input type="range" min={0} max={duration} value={progress} onChange={handleProgress}/>*/}

                            <Slider
                                aria-label="time-indicator"
                                size="small"
                                value={progress}
                                onChange={handleProgress}
                                min={0}
                                max={duration}
                                sx={{
                                    color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
                                    height: 4,
                                    '& .MuiSlider-thumb': {
                                        width: 8,
                                        height: 8,
                                        transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                                        '&:before': {
                                            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                                        },
                                        '&:hover, &.Mui-focusVisible': {
                                            boxShadow: `0px 0px 0px 8px ${
                                                theme.palette.mode === 'dark'
                                                    ? 'rgb(255 255 255 / 16%)'
                                                    : 'rgb(0 0 0 / 16%)'
                                            }`,
                                        },
                                        '&.Mui-active': {
                                            width: 20,
                                            height: 20,
                                        },
                                    },
                                    '& .MuiSlider-rail': {
                                        opacity: 0.28,
                                    },
                                }}
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mt: -2,
                                }}
                            >
                                <TinyText>{formatDuration(progress)}</TinyText>
                                <TinyText>-{formatDuration(duration - progress)}</TinyText>
                            </Box>

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
                            <input type="range" min={0} max={1} step={0.01} value={volume} onChange={handleVolume}/>
                            <IconButton aria-label="mute" onClick={handleMute}>
                                {volume > 0.5 ? <VolumeUp/> : volume > 0 ? <VolumeDown/> : <VolumeOff/>}
                                </IconButton>

                        </CardActions>
                    </Box>
                </Card>
            )}
        </div>
    );
}

