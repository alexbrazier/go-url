import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
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
  urlReplace: {
    color: '#4c4c4c',
    fontWeight: 700,
  },
}));

export default useStyles;
