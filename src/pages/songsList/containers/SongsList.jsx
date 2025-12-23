import { useIntl } from 'react-intl';
import { createUseStyles } from 'react-jss';
import React, { useEffect, useState } from 'react';
import Typography from 'components/Typography';
import Button from 'components/Button';
import Select from 'components/Select';
import MenuItem from 'components/MenuItem';
import Card from 'components/Card';
import Pagination from 'components/Pagination';
import Hover from 'components/Hover';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DeleteIcon from 'components/icons/Delete';
import CardTitle from 'components/CardTitle';
import CardActions from 'components/CardActions';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from 'components/Dialog';
import CardContent from 'components/CardContent';
import Alert from 'components/Alert';
import actionsSong from '../../../app/actions/song';
import { secondsToTime } from '../../../app/actions/song';

const getClasses = createUseStyles((theme) => ({
    header: {
        marginBottom: '20px'
    },
    filterContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',   
        gap: '10px',
        marginBottom: '20px',
        width: '100%',
    },
    buttonsRow: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    list: {
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px',
        width: '100%',
    },
    listRow: {
        width: '100%',
    },
    cardTitle: {
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        width: '100%', 
        padding: '12px 20px'
    },
    pagination: {
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '40px'
    },
    filterFields: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '15px',
        marginTop: '10px',
        borderRadius: '8px',
        boxShadow: '0px 2px 8px rgba(0,0,0,0.1)', 
        width: 'fit-content' 
    },
    alertContainer: {
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    fieldWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        width: '100%'
    },
    labelCaption: {
        fontSize: '12px',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    selectText: {
        fontSize: '14px'
    },
    songInfo: {
        display: 'flex',
        gap: '15px',
        alignItems: 'center'
    },
    actionWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    deleteIconBox: {
        width: '30px',
        display: 'flex',
        justifyContent: 'center'
    },
    deleteBtn: {
        cursor: 'pointer',
        display: 'flex'
    },
    dialogActions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        padding: '20px',
        alignItems: 'center'
    },
    dialogButtonsRow: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        width: '100%'
    },
    errorText: {
        textAlign: 'center',
        width: '100%',
        fontWeight: 'bold',
        marginTop: '5px'
    }
}));

function SongsList() {
    const { formatMessage } = useIntl();
    const classes = getClasses();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const selectedGenreParam = searchParams.get('genre') || '';
    const selectedDurationSortParam = searchParams.get('sort') || '';
    
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState(selectedGenreParam);
    const [selectedDurationSort, setSelectedDurationSort] = useState(selectedDurationSortParam);
    const [hoveredId, setHoveredId] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [songToDelete, setSongToDelete] = useState(null);

    const { list: songs = [], totalPages = 1 } = useSelector(state => state.song || {});
    const genres = ['Rock', 'Pop', 'Jazz', 'Techno'];

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setSongToDelete(null);
    };

    const handleOpenDeleteDialog = (song) => {
        setSongToDelete(song);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (songToDelete) {
            dispatch(actionsSong.fetchDeleteSong(songToDelete.id))
                .then(() => {
                    setShowSuccessAlert(true);
                    setShowErrorAlert(false);
                    handleCloseDeleteDialog();
                    setTimeout(() => setShowSuccessAlert(false), 3000);
                })
                .catch(() => {
                    setShowErrorAlert(true);
                    setShowSuccessAlert(false);
                });
        }
    };
  
    const handleNavigateToSongDetails = (id) => {
        navigate(`/songDetails/${id}`); 
    };

    const handleNavigateToCreateSongForm = () => {
        navigate(`/songDetails/create`); 
    };

    useEffect(() => {
        dispatch(actionsSong.fetchSongs({
            page: currentPage,
            genres: selectedGenreParam, 
            sort: selectedDurationSortParam,
            limit: 5
        }));
    }, [dispatch, currentPage, selectedGenreParam, selectedDurationSortParam]);

    const handleApplyFilters = () => {
        setSearchParams({
            page: '1',
            genre: selectedGenre,
            sort: selectedDurationSort
        });
    };

    const handlePageChange = (event, value) => {
        setSearchParams({
            page: value,
            genre: selectedGenreParam,
            sort: selectedDurationSortParam
        });
    };

    return (
        <div>
            <div className={classes.alertContainer}>
                {showSuccessAlert && <Alert severity="success">{formatMessage({ id: 'alert.delete.success' })}</Alert>}
                {showErrorAlert && <Alert severity="error">{formatMessage({ id: 'alert.delete.error' })}</Alert>}
            </div>

            <div className={classes.header}>
                <Typography variant='title'>
                    {formatMessage({ id: 'title' })}
                </Typography>
            </div>
            
            <div className={classes.filterContainer}>
                <div className={classes.buttonsRow}>
                    <Button 
                        onClick={() => setIsFilterVisible(!isFilterVisible)}
                        variant={isFilterVisible ? "primary" : "secondary"}
                    >
                        {isFilterVisible ? formatMessage({ id: 'hideFilter' }) : formatMessage({ id: 'filter' })}
                    </Button>

                    <Button onClick={handleNavigateToCreateSongForm} colorVariant="primary">
                        {formatMessage({ id: 'addSong' })}
                    </Button>
                </div>

                {isFilterVisible && (
                    <div className={classes.filterFields}>
                        <div className={classes.fieldWrapper}>
                            <Typography variant="caption" color="secondary" className={classes.labelCaption}>
                                {formatMessage({ id: 'duration' })}
                            </Typography>
                            <Select value={selectedDurationSort} onChange={(e) => setSelectedDurationSort(e.target.value)} displayEmpty>
                                <MenuItem value="">
                                <Typography variant="default" className={classes.selectText}>{formatMessage({ id: 'sort.none' })}</Typography>
                                </MenuItem>
                                <MenuItem value="desc">
                                <Typography variant="default" className={classes.selectText}>{formatMessage({ id: 'sort.desc' })}</Typography>
                                </MenuItem>
                                <MenuItem value="asc">
                                <Typography variant="default" className={classes.selectText}>{formatMessage({ id: 'sort.asc' })}</Typography>
                                </MenuItem>
                            </Select>
                        </div>

                        <div className={classes.fieldWrapper}>
                            <Typography variant="caption" color="secondary" className={classes.labelCaption}>
                                {formatMessage({ id: 'genre' })}
                            </Typography>
                            <Select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} displayEmpty>
                                <MenuItem value="">
                                    <Typography 
                                        variant="default" 
                                        color="secondary" 
                                        className={classes.selectText}>
                                            {formatMessage({ id: 'genre.all' })}
                                    </Typography>
                                </MenuItem>
                                {genres.map((genre) => (
                                    <MenuItem key={genre} value={genre}>
                                        <Typography variant="default" className={classes.selectText}>{genre}</Typography>
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>

                        <Button onClick={handleApplyFilters} colorVariant='primary'>
                            {formatMessage({ id: 'apply' })}
                        </Button>
                    </div>
                )}
            </div>

            <div className={classes.list}>
                {songs.map((song) => (
                    <div 
                        key={song.id} 
                        className={classes.listRow}
                        onMouseEnter={() => setHoveredId(song.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <Card variant="paper" disablePaddings>
                            <Hover onClick={() => handleNavigateToSongDetails(song.id)}>
                                <div className={classes.cardTitle}>
                                    <div className={classes.songInfo}>
                                        <Typography variant="title">{song.title}</Typography>
                                        <Typography variant="caption" color="secondary">
                                            {song.artistName}
                                        </Typography>
                                    </div>

                                    <CardActions>
                                        <div className={classes.actionWrapper}>
                                            <Typography variant="default">
                                                {secondsToTime(song.duration)}
                                            </Typography>
                                            
                                            <div className={classes.deleteIconBox}>
                                                {hoveredId === song.id && (
                                                    <div 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenDeleteDialog(song);
                                                        }}
                                                        className={classes.deleteBtn}
                                                    >
                                                        <DeleteIcon color="error" size={24} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardActions>
                                </div>
                            </Hover>
                        </Card>
                    </div>
                ))}
            </div>

            <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog} maxWidth="xs">
                <Card>
                    <CardTitle>
                        <Typography variant="subTitle">{formatMessage({ id: 'delete.confirmation.title' })}</Typography>
                    </CardTitle>
                    <CardContent>
                        <Typography variant="default">
                            {formatMessage({ id: 'delete.confirmation.text' })} <strong>{songToDelete?.title}</strong>?
                        </Typography>
                    </CardContent>
                    
                    <div className={classes.dialogActions}>
                        <div className={classes.dialogButtonsRow}>
                            <Button onClick={handleCloseDeleteDialog} variant="secondary">
                                <Typography>{formatMessage({ id: 'btn.cancel' })}</Typography>
                            </Button>
                            <Button onClick={handleConfirmDelete} variant="primary">
                                <Typography color="inherit">{formatMessage({ id: 'btn.delete' })}</Typography>
                            </Button>
                        </div>
                        {showErrorAlert && (
                            <Typography color="error" variant="caption" className={classes.errorText}>
                                {formatMessage({ id: 'alert.delete.error' })}
                            </Typography>
                        )}
                    </div>
                </Card>
            </Dialog>

            <div className={classes.pagination}>
                <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
            </div>
        </div>
    );
}

export default SongsList;