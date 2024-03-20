import * as React from "react";
import Autocomplete, { createFilterOptions } from "@mui/joy/Autocomplete";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";

const filter = createFilterOptions();

const disableSelectedPlayers = (allSelectedPlayers) => (option) =>
  allSelectedPlayers.includes(option.id);

export default function InputAutocomplete({
  players,
  allSelectedPlayers,
  teamId,
  onExistingPlayerSelected,
  onNewPlayerAdded,
  footerText,
}) {
  const [value, setValue] = React.useState(null);
  const [open, toggleOpen] = React.useState(false);

  const hasConfirmedTeam = teamId !== 0;

  const handleClose = () => {
    setDialogValue({
      name: "",
      id: "",
    });

    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    name: "",
    id: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setValue({
      name: dialogValue.name,
    });
    onNewPlayerAdded(dialogValue.name);

    handleClose();
  };

  return (
    <React.Fragment>
      <FormControl>
        <FormLabel>Add a player</FormLabel>
        <Autocomplete
          value={value}
          disabled={hasConfirmedTeam}
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
              // timeout to avoid instant validation of the dialog's form.
              setTimeout(() => {
                toggleOpen(true);
                setDialogValue({
                  name: newValue,
                  id: "",
                });
              });
            } else if (newValue && newValue.inputValue) {
              toggleOpen(true);
              setDialogValue({
                name: newValue.inputValue,
                id: "",
              });
            } else {
              setValue(newValue);
              onExistingPlayerSelected(newValue);
              setValue("");
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            if (params.inputValue !== "" && filtered.length === 0) {
              filtered.push({
                inputValue: params.inputValue,
                name: `Add "${params.inputValue}"`,
              });
            }

            return filtered;
          }}
          options={players}
          getOptionLabel={(option) => {
            // e.g. value selected with enter, right from the input
            if (typeof option === "string") {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.name;
          }}
          getOptionDisabled={disableSelectedPlayers(allSelectedPlayers)}
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          renderOption={(props, option) => (
            <AutocompleteOption {...props}>{option.name}</AutocompleteOption>
          )}
          sx={{ width: 300 }}
        />
        <FormHelperText>{footerText}</FormHelperText>
      </FormControl>

      <Modal open={open} onClose={handleClose}>
        <ModalDialog>
          <form onSubmit={handleSubmit}>
            <Typography
              component="h2"
              level="inherit"
              fontSize="1.25em"
              mb="0.25em"
            >
              Add a new player
            </Typography>
            <Typography mt={0.5} mb={2} textColor="text.tertiary">
              Please double check if player already exists.
            </Typography>
            <Stack spacing={2}>
              <FormControl id="name">
                <FormLabel>Name</FormLabel>
                <Input
                  autoFocus
                  type="text"
                  value={dialogValue.name}
                  onChange={(event) =>
                    setDialogValue({
                      ...dialogValue,
                      name: event.target.value,
                    })
                  }
                />
              </FormControl>
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button variant="plain" color="neutral" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit">Add</Button>
              </Stack>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
