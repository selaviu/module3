import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import Typography from 'components/Typography';
import Button from 'components/Button';
import Card from 'components/Card';
import TextField from 'components/TextField';
import EditIcon from 'components/icons/Edit';
import Alert from 'components/Alert';

import actionsSong, { secondsToTime, timeToSeconds } from '../../../app/actions/song';

const useStyles = createUseStyles((theme) => ({
    root: { padding: '20px' },
    header: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
    },
    form: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px', 
        padding: '20px' 
    },
    fieldGroup: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px' 
    },
    actions: { 
        display: 'flex', 
        gap: '10px', 
        justifyContent: 'flex-end', 
        marginTop: '20px' 
    }
}));

function SongDetails() {
    const { formatMessage } = useIntl();
    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
  
    const isCreation = id === 'create';
  
    const [isEditMode, setIsEditMode] = useState(isCreation);
    const [formData, setFormData] = useState({ title: '', artistName: '', duration: '', album: '', releaseYear: '', genres: ''});
    const [initialData, setInitialData] = useState({}); 
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState(null);
    const { currentSong } = useSelector(state => state.song || {});

    useEffect(() => {
        if (!isCreation && id) {
            dispatch(actionsSong.fetchSongDetails(id));
        }
    }, [dispatch, id, isCreation]);

    useEffect(() => {
        if (currentSong && !isCreation) {
            const preparedData = {
                ...currentSong,
                duration: currentSong.duration !== undefined ? secondsToTime(currentSong.duration) : '',
                genres: Array.isArray(currentSong.genres) 
                    ? currentSong.genres.join(', ') 
                    : currentSong.genres || ''
            };
            setFormData(preparedData);
            setInitialData(preparedData);
        }
    }, [currentSong, isCreation]);

    const validate = () => {
        const newErrors = {};
        if (!formData.title?.trim()) newErrors.title = formatMessage({ id: 'songDetails.error.title' });
        if (!formData.artistName?.trim()) newErrors.artistName = formatMessage({ id: 'songDetails.error.artist' });
        if (!formData.duration?.trim()) newErrors.duration = formatMessage({ id: 'songDetails.error.duration' });
        
        const yearStr = String(formData.releaseYear || '');
        if (!yearStr.trim()) newErrors.releaseYear = formatMessage({ id: 'songDetails.error.releaseYear' });
        if (!formData.genres?.trim()) newErrors.genres = formatMessage({ id: 'songDetails.error.genres' });
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const saveAction = isCreation 
            ? actionsSong.fetchCreateSong(formData) 
            : actionsSong.fetchUpdateSong(id, formData);

        dispatch(saveAction)
            .then(() => {
                setInitialData(formData);
                setIsEditMode(false);
                setNotification({ 
                    type: 'success', 
                    text: isCreation 
                        ? formatMessage({ id: 'songDetails.notif.successCreate' }) 
                        : formatMessage({ id: 'songDetails.notif.successUpdate' })
                });
                
                setTimeout(() => {
                    setNotification(null);
                    if (isCreation) navigate('/songsList');
                }, 2000);
            })
            .catch(() => {
                setNotification({ type: 'error', text: formatMessage({ id: 'songDetails.notif.error' }) });
            });
    };

    const handleCancel = () => {
        if (isCreation) {
            navigate(-1);
        } else {
            setFormData(initialData); 
            setErrors({});
            setIsEditMode(false);
        }
    };

    return (
        <div className={classes.root}>
            {notification && <Alert severity={notification.type}>{notification.text}</Alert>}

            <div className={classes.header}>
                <Button onClick={() => navigate(-1)} variant="secondary">{formatMessage({ id: 'button.back' })}</Button>
                {!isEditMode && (
                    <div onClick={() => setIsEditMode(true)} style={{ cursor: 'pointer' }}>
                        <EditIcon size={24} color="primary" />
                    </div>
                )}
            </div>

            <Card>
                <div className={classes.form}>
                    <Typography variant="title">
                        {isEditMode 
                            ? (isCreation ? formatMessage({ id: 'songDetails.title.create' }) : formatMessage({ id: 'songDetails.title.edit' })) 
                            : formatMessage({ id: 'songDetails.title.view' })}
                    </Typography>

                    <div className={classes.fieldGroup}>
                        <Typography variant="caption" color="secondary">{formatMessage({ id: 'songDetails.label.title' })}</Typography>
                        {isEditMode ? (
                            <TextField 
                                value={formData.title} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                error={!!errors.title}
                                helperText={errors.title}
                            />
                        ) : (
                            <Typography variant="default">{formData.title}</Typography>
                        )}
                    </div>

                    <div className={classes.fieldGroup}>
                        <Typography variant="caption" color="secondary">{formatMessage({ id: 'songDetails.label.artist' })}</Typography>
                        {isEditMode ? (
                            <TextField 
                                value={formData.artistName} 
                                onChange={(e) => setFormData({...formData, artistName: e.target.value})}
                                error={!!errors.artistName}
                                helperText={errors.artistName}
                            />
                        ) : (
                            <Typography variant="default">{formData.artistName}</Typography>
                        )}
                    </div>

                    <div className={classes.fieldGroup}>
                        <Typography variant="caption" color="secondary">{formatMessage({ id: 'songDetails.label.duration' })}</Typography>
                        {isEditMode ? (
                            <TextField 
                                value={timeToSeconds(formData.duration) || ''} 
                                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                error={!!errors.duration}
                                helperText={errors.duration}
                            />
                        ) : (
                            <Typography variant="default">{formData.duration}</Typography>
                        )}
                    </div>

                    <div className={classes.fieldGroup}>
                        <Typography variant="caption" color="secondary">{formatMessage({ id: 'songDetails.label.album' })}</Typography>
                        {isEditMode ? (
                            <TextField 
                                value={formData.album || ''} 
                                onChange={(e) => setFormData({...formData, album: e.target.value})}
                                error={!!errors.album}
                                helperText={errors.album}
                            />
                        ) : (
                            <Typography variant="default">{formData.album}</Typography>
                        )}
                    </div>

                    <div className={classes.fieldGroup}>
                        <Typography variant="caption" color="secondary">{formatMessage({ id: 'songDetails.label.year' })}</Typography>
                        {isEditMode ? (
                            <TextField 
                                value={formData.releaseYear || ''} 
                                onChange={(e) => setFormData({...formData, releaseYear: e.target.value})}
                                error={!!errors.releaseYear}
                                helperText={errors.releaseYear}
                            />
                        ) : (
                            <Typography variant="default">{formData.releaseYear}</Typography>
                        )}
                    </div>

                    <div className={classes.fieldGroup}>
                        <Typography variant="caption" color="secondary">{formatMessage({ id: 'songDetails.label.genres' })}</Typography>
                        {isEditMode ? (
                            <TextField 
                                value={formData.genres || ''} 
                                onChange={(e) => setFormData({...formData, genres: e.target.value})}
                                error={!!errors.genres}
                                helperText={errors.genres}
                            />
                        ) : (
                            <Typography variant="default">{formData.genres}</Typography>
                        )}
                    </div>

                    {isEditMode && (
                        <div className={classes.actions}>
                            <Button onClick={handleCancel} variant="secondary">{formatMessage({ id: 'button.cancel' })}</Button>
                            <Button onClick={handleSave} variant="primary">
                                {isCreation ? formatMessage({ id: 'button.create' }) : formatMessage({ id: 'button.save' })}
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default SongDetails;