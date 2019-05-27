import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  grow: {
    flexGrow: 1,
  },
  name: {
    marginLeft: 20,
    fontWeight: 500,
  },
  link: {
    textDecoration: 'none',
    padding: 10,
    color: 'white',
    marginLeft: 30,
    fontWeight: 600,
  },
});

export default useStyles;
