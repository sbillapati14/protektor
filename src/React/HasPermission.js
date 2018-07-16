import React from 'react'; // eslint-disable-line
// import PropTypes from 'prop-types';

export const HasPermission = ({
  to, access, forRole, children
}) => forRole.hasPermission({ action: to, resource: access })
  && (typeof children === 'function' ? children() : React.Children.only(children));
