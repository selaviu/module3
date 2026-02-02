import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";

import Typography from "components/Typography";
import Button from "components/Button";
import Card from "components/Card";
import TextField from "components/TextField";
import EditIcon from "components/icons/Edit";
import Alert from "components/Alert";
import categoriesActions from "../../../app/actions/categories";
import artistsActions from "../../../app/actions/artists";
import albumsActions from "../../../app/actions/album";

import actionsSong, {
  secondsToTime,
  timeToSeconds,
} from "../../../app/actions/song";
import { Checkbox, Select, MenuItem } from "@mui/material";
import GenreSelect from "../../../components/GenreSelect/GenreSelect";
import FreeSoloInput from "../../../components/FreeSoloInput/FreeSoloInput";
import stream from "app/actions/stream";

const useStyles = createUseStyles((theme) => ({
  root: { padding: "20px" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "20px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  actions: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
    marginTop: "20px",
  },
}));

function SongDetails() {
  const { formatMessage } = useIntl();
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const isCreation = id === "create";

  const [isEditMode, setIsEditMode] = useState(isCreation);
  const [formData, setFormData] = useState({
    title: "",
    artistId: "",
    duration: "",
    albumId: "",
    releaseYear: "",
    genresId: [],
  });
  const [initialData, setInitialData] = useState({});
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const { currentSong } = useSelector((state) => state.song || {});

  useEffect(() => {
    if (!isCreation && id) {
      dispatch(actionsSong.fetchSongDetails(id));
    }
  }, [dispatch, id, isCreation]);

  useEffect(() => {
    if (currentSong && !isCreation) {
      dispatch(stream.fetchStreamCount(currentSong?.id));

      const preparedData = {
        id: currentSong.id,
        title: currentSong.title || "",
        releaseYear: currentSong.releaseYear || "",
        duration:
          currentSong.duration !== undefined
            ? secondsToTime(currentSong.duration)
            : "",

        artistId: currentSong.artistInfo?.id || "",
        albumId: currentSong.album?.id || "",

        genresId: Array.isArray(currentSong.genres)
          ? currentSong.genres.map((g) => g.id)
          : [],
      };

      setFormData(preparedData);
      setInitialData(preparedData);
    }
  }, [currentSong, isCreation]);

  const { list, isFetching } = useSelector(
    (state) => state.categories || { list: [], isFetching: false },
  );
  const { list: artistsList } = useSelector(
    (state) => state.artists || { list: [], isFetching: false },
  );
  const { list: albumsList } = useSelector(
    (state) => state.albums || { list: [], isFetching: false },
  );
  const streamCounts = useSelector((state) => state.stream.counts || {});
  useEffect(() => {
    if (list.length === 0) {
      dispatch(categoriesActions.fetchCategories());
    }
  }, [dispatch, list.length]);

  useEffect(() => {
    dispatch(artistsActions.fetchArtists());
    dispatch(albumsActions.fetchAlbums());
  }, [dispatch]);

  const validate = () => {
    const newErrors = {};
    console.log("Validating formData:", formData);
    if (!formData.title?.trim())
      newErrors.title = formatMessage({ id: "songDetails.error.title" });
    if (!formData.artistId)
      newErrors.artistId = formatMessage({ id: "songDetails.error.artist" });
    if (!formData.duration?.trim())
      newErrors.duration = formatMessage({ id: "songDetails.error.duration" });
    if (!formData.albumId?.trim())
      newErrors.albumId = formatMessage({ id: "songDetails.error.duration" });
    const yearStr = String(formData.releaseYear || "");
    if (!yearStr.trim())
      newErrors.releaseYear = formatMessage({
        id: "songDetails.error.releaseYear",
      });
    if (!formData.genresId || formData.genresId.length === 0)
      newErrors.genresId = formatMessage({ id: "songDetails.error.genres" });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    console.log("Attempting to save formData:", formData);
    if (!validate()) return;
    console.log("Saving formData:", formData);
    const saveAction = isCreation
      ? actionsSong.fetchCreateSong(formData)
      : actionsSong.fetchUpdateSong(id, formData);

    dispatch(saveAction)
      .then(() => {
        setInitialData(formData);
        setIsEditMode(false);
        setNotification({
          type: "success",
          text: isCreation
            ? formatMessage({ id: "songDetails.notif.successCreate" })
            : formatMessage({ id: "songDetails.notif.successUpdate" }),
        });

        setTimeout(() => {
          setNotification(null);
          if (isCreation) navigate("/songsList");
        }, 2000);
      })
      .catch(() => {
        setNotification({
          type: "error",
          text: formatMessage({ id: "songDetails.notif.error" }),
        });
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
      {notification && (
        <Alert severity={notification.type}>{notification.text}</Alert>
      )}

      <div className={classes.header}>
        <Button onClick={() => navigate(-1)} variant="secondary">
          {formatMessage({ id: "button.back" })}
        </Button>
        {!isEditMode && (
          <div
            onClick={() => setIsEditMode(true)}
            style={{ cursor: "pointer" }}
          >
            <EditIcon size={24} color="primary" />
          </div>
        )}
      </div>

      <Card>
        <div className={classes.form}>
          <Typography variant="title">
            {isEditMode
              ? isCreation
                ? formatMessage({ id: "songDetails.title.create" })
                : formatMessage({ id: "songDetails.title.edit" })
              : formatMessage({ id: "songDetails.title.view" })}
          </Typography>

          <div className={classes.fieldGroup}>
            <Typography variant="caption" color="secondary">
              {formatMessage({ id: "songDetails.label.title" })}
            </Typography>
            {isEditMode ? (
              <TextField
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                error={!!errors.title}
                helperText={errors.title}
              />
            ) : (
              <Typography variant="default">{formData.title}</Typography>
            )}
          </div>

          <div className={classes.fieldGroup}>
            <Typography variant="caption" color="secondary">
              {formatMessage({ id: "songDetails.label.artist" })}
            </Typography>
            {!isEditMode ? (
              <Typography variant="default">
                {currentSong?.artistInfo?.name || "—"}
              </Typography>
            ) : (
              <FreeSoloInput
                label={formatMessage({ id: "songDetails.label.artist" })}
                options={artistsList}
                value={formData.artistId}
                onChange={(val) => setFormData({ ...formData, artistId: val })}
                formatMessage={formatMessage}
              />
            )}
          </div>

          <div className={classes.fieldGroup}>
            <Typography variant="caption" color="secondary">
              {formatMessage({ id: "songDetails.label.duration" })}
            </Typography>
            {isEditMode ? (
              <TextField
                value={timeToSeconds(formData.duration) || ""}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                error={!!errors.duration}
                helperText={errors.duration}
              />
            ) : (
              <Typography variant="default">{formData.duration}</Typography>
            )}
          </div>

          <div className={classes.fieldGroup}>
            <Typography variant="caption" color="secondary">
              {formatMessage({ id: "songDetails.label.album" })}
            </Typography>
            {!isEditMode ? (
              <Typography variant="default">
                {currentSong?.album?.name || "—"}
              </Typography>
            ) : (
              <FreeSoloInput
                label={formatMessage({ id: "songDetails.label.album" })}
                options={albumsList}
                value={formData.albumId}
                onChange={(val) => setFormData({ ...formData, albumId: val })}
                formatMessage={formatMessage}
              />
            )}
          </div>

          <div className={classes.fieldGroup}>
            <Typography variant="caption" color="secondary">
              {formatMessage({ id: "songDetails.label.year" })}
            </Typography>
            {isEditMode ? (
              <TextField
                value={formData.releaseYear || ""}
                onChange={(e) =>
                  setFormData({ ...formData, releaseYear: e.target.value })
                }
                error={!!errors.releaseYear}
                helperText={errors.releaseYear}
              />
            ) : (
              <Typography variant="default">{formData.releaseYear}</Typography>
            )}
          </div>

          <div className={classes.fieldGroup}>
            <Typography variant="caption" color="secondary">
              {formatMessage({ id: "songDetails.label.genres" })}
            </Typography>
            {!isEditMode ? (
              <Typography variant="default">
                {currentSong?.genres?.map((g) => g.name).join(", ") || "—"}
              </Typography>
            ) : (
              <GenreSelect
                selectedGenres={formData.genresId}
                onChange={(selected) =>
                  setFormData({ ...formData, genresId: selected })
                }
                formatMessage={formatMessage}
              />
            )}
          </div>
          {!isEditMode && !isCreation && (
            <div className={classes.fieldGroup}>
              <Typography variant="caption" color="secondary">
                {formatMessage({ id: "songDetails.label.streams" })}
              </Typography>
              <Typography variant="default">
                {streamCounts[currentSong?.id] !== undefined
                  ? streamCounts[currentSong?.id]
                  : 0}
              </Typography>
            </div>
          )}

          {isEditMode && (
            <div className={classes.actions}>
              <Button onClick={handleCancel} variant="secondary">
                {formatMessage({ id: "button.cancel" })}
              </Button>
              <Button onClick={handleSave} variant="primary">
                {isCreation
                  ? formatMessage({ id: "button.create" })
                  : formatMessage({ id: "button.save" })}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default SongDetails;
