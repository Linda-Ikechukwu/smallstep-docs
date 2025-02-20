import { Link } from 'gatsby';
import { default as React } from 'react';
import { Heading } from '@smallstep/step-ui';
import { makeStyles } from '@material-ui/core/styles';
import {
  connectStateResults,
  connectHits,
  Highlight,
  Index,
  Snippet,
} from 'react-instantsearch-dom';
import { Box, Typography, ListItem, ListItemText } from '@material-ui/core';

const useStyles = makeStyles((classes) => ({
  resultsBorder: {
    borderBottom: `1px solid ${classes.palette.accent.grey3}`,
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  hits: {
    '& mark ': {
      backgroundColor: classes.palette.accent.yellow,
    },
  },
}));

const HitCount = connectStateResults(({ searchResults }) => {
  const hitCount = searchResults && searchResults.nbHits;
  const classes = useStyles();
  return hitCount > 0 ? (
    <Box textAlign={'right'} className={classes.resultsBorder} mb={2} mr={1}>
      <Typography variant="body2">
        {hitCount} result{hitCount !== 1 ? `s` : ``}
      </Typography>
    </Box>
  ) : (
    <Box textAlign={'center'} minWidth={295}>
      <Typography variant="body2"> There are no results found.</Typography>
    </Box>
  );
});

const PageHit = ({ hit }) => {
  const classes = useStyles();

  return (
    <Link
      to={
        hit.title[0] === hit.title[0].toUpperCase()
          ? `/docs/${hit.slug}`
          : `/docs/step-cli/reference/${hit.slug}`
      }
      className={classes.link}
    >
      <ListItem button attribute="slug" hit={hit} className={classes.hits}>
        <ListItemText
          primary={
            <Heading variant="h6">
              <Highlight attribute="title" hit={hit} tagName="mark" />
            </Heading>
          }
          secondary={
            <Typography variant="body2">
              <Snippet attribute="excerpt" hit={hit} tagName="mark" />
            </Typography>
          }
        />
      </ListItem>
    </Link>
  );
};

const Hits = connectHits(({ hits }) =>
  hits.map((hit) => <PageHit key={hit.slug} hit={hit} />)
);

function HitsInIndex({ index }) {
  return (
    <Index indexName={index.name}>
      <HitCount />
      <Hits hitComponent={PageHit} />
    </Index>
  );
}

const SearchResult = ({ indices }) => (
  <Box>
    {indices.map((index) => (
      <HitsInIndex index={index} key={index.name} />
    ))}
  </Box>
);

export default SearchResult;
