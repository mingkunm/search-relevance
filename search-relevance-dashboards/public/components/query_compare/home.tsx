/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { NavigationPublicPluginStart } from 'src/plugins/navigation/public';
import { CoreStart, ChromeBreadcrumb } from '../../../../../src/core/public';
import '../../ace-themes/sql_console';
import { CreateIndex } from './create_index';
import { SearchResult } from './search_result';

import './home.scss';

interface QueryExplorerProps {
  parentBreadCrumbs: ChromeBreadcrumb[];
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
  setBreadcrumbs: (newBreadcrumbs: ChromeBreadcrumb[]) => void;
  setToast: (title: string, color?: string, text?: any, side?: string) => void;
  chrome: CoreStart['chrome'];
}

export const Home = ({
  parentBreadCrumbs,
  notifications,
  http,
  navigation,
  setBreadcrumbs,
  setToast,
  chrome,
}: QueryExplorerProps) => {
  const [hasIndex, setHasIndex] = useState(false);

  useEffect(() => {
    setBreadcrumbs([...parentBreadCrumbs]);
  }, []);

  // TODO: Get index api
  useEffect(() => {
    setHasIndex(false);
  }, []);

  return (
    <div className="search-relevance">
      {hasIndex ? <SearchResult http={http} /> : <CreateIndex />}
    </div>
  );
};
