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

    const {loading, error, data} = useQuery(ALLTRACKS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;




    const togglePlay = () => {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    }

    const nextTrack = () => {
        const index = tracks.findIndex((track) => track.node.id === currentTrack.node.id);
        const nextTrack = tracks[index + 1];
        if (nextTrack) {
            setCurrentTrack(nextTrack.node);
        }
    }

    const prevTrack = () => {
        const index = tracks.findIndex((track) => track.node.id === currentTrack.node.id);
        const prevTrack = tracks[index - 1];
        if (prevTrack) {
            setCurrentTrack(prevTrack.node);
        }
    }

    const onEnded = () => {
        nextTrack();
        audio.play();
    }

    const onTimeUpdate = () => {
        const currentTime = audio.currentTime;
        const duration = audio.duration;
        setProgress((currentTime / duration) * 100);
    }

    const onLoadedMetadata = () => {
        setProgress(0);
    }

    const onLoadedData = () => {
        setAudio(audio);
    }

    const onPlay = () => {
        setIsPlaying(true);
    }

    const onPause = () => {
        setIsPlaying(false);
    }

    let tracks = data.diffusionsOfShowByUrl.edges;

    return (
        <div>
            <Card sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <CardMedia
                    component="img"
                    sx={{width: 151}}
                    image="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/France_Culture_logo_2021.svg/800px-France_Culture_logo_2021.svg.png"
                    alt="Live from space album cover"
                />
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <CardContent sx={{flex: '1 0 auto'}}>
                        <Typography variant="subtitle1" color="text.secondary">
                            {tracks ? tracks[0].node.podcastEpisode.title : 'Select a track'}
                            <Typography variant="body1" color="text.secondary" >
                                {tracks[0].node.published_date}
                            </Typography>
                        </Typography>
                    </CardContent>
                    <CardActions sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <IconButton aria-label="previous" onClick={prevTrack}>
                            <SkipPreviousRounded/>
                        </IconButton>
                        <IconButton aria-label="play/pause" onClick={togglePlay}>
                            {isPlaying ? <PauseCircle/> : <PlayCircle/>}
                        </IconButton>
                        <IconButton aria-label="next" onClick={nextTrack}>
                            <SkipNextIcon/>
                        </IconButton>
                    </CardActions>
                </Box>
            </Card>
            <audio
              src={currentTrack ? currentTrack.podcastEpisode.url :  tracks[0].node.podcastEpisode.url}
                ref={(ref) => {
                    setAudio(ref);
                }
                }
                onLoadedMetadata={onLoadedMetadata}
                onLoadedData={onLoadedData}
                onTimeUpdate={onTimeUpdate}
                onPlay={onPlay}
                onPause={onPause}
                onEnded={onEnded}
            />
        </div>
    )
}
