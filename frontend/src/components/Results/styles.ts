import { Theme, createStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
  paper: {
    padding: 15,
    overflowX: 'auto',
  },
  url: {
    color: 'grey',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  launchIcon: {
    width: 10,
  },
  edit: {
    color: 'grey',
  },
  editIcon: {
    padding: 3,
  },
  tableRow: {
    height: 'initial',
  },
  urlCell: {
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    maxWidth: 300,
    [theme.breakpoints.down('xs')]: {
      maxWidth: 100,
    },
  },
});

export default styles;
