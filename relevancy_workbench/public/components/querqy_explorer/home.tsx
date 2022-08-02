import {
  EuiPage,
  EuiPageBody,
  EuiPageHeader,
  EuiTitle,
  EuiPageContentBody,
  EuiPanel,
  EuiText,
  EuiFieldText,
  EuiSpacer,
  EuiCodeEditor,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiCodeBlock,
  EuiButtonGroup,
} from '@elastic/eui';
import { CoreStart, ChromeBreadcrumb } from '../../../../../src/core/public';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { NavigationPublicPluginStart } from 'src/plugins/navigation/public';
import DSLService from '../../services/dsl';
import { RelevancySideBar } from '../common_utils/side_nav';
import { PLUGIN_EXPLORER_URL, PLUGIN_EXPLORER_NAME } from '../../../common';
import '../../ace-themes/sql_console';
import { ConfigureFlyout } from './configure_flyout';

interface QueryExplorerProps {
  parentBreadCrumbs: ChromeBreadcrumb[];
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
  setBreadcrumbs: (newBreadcrumbs: ChromeBreadcrumb[]) => void;
  dslService: DSLService;
  setToast: (title: string, color?: string, text?: any, side?: string) => void;
}

export const Home = ({
  parentBreadCrumbs,
  notifications,
  http,
  navigation,
  setBreadcrumbs,
  dslService,
  setToast,
}: QueryExplorerProps) => {
  // Use React hooks to manage state.
  const [querqyResult, setQuerqyResult] = useState('');
  const [queryString, setQueryString] = useState('');
  const [indexValue, setIndexValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
  const [searchToken, setSearchToken] = useState('iphone');
  const [toggleIdSelected, setToggleIdSelected] = useState('edit-mode-btn');
  const [isEditMode, setIsEditMode] = useState(true);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIndexValue(e.target.value);
  };

  const onClickHandler = () => {
    setIsLoading(true);
    let jsonQuery;
    try {
      if (queryString === '' || searchToken === '') setToast('Query/Search token cannot be empty');
      else {
        jsonQuery = JSON.parse(queryString.replace(/%searchToken%/g, searchToken));
      }
    } catch (error) {
      setQuerqyResult(error.message);
      console.error(error);
      setIsLoading(false);
      return;
    }

    http
      .post('/api/relevancy/search', {
        body: JSON.stringify({ index: indexValue, ...jsonQuery }),
      })
      .then((res) => {
        setQuerqyResult(res);
      })
      .catch((error: Error) => {
        setQuerqyResult(error.body.message);
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onChangeEdit = (optionId: string) => {
    if (optionId === 'edit-mode-btn') setIsEditMode(true);
    else setIsEditMode(false);
    setToggleIdSelected(optionId);
  };

  const closeFlyout = () => {
    setIsFlyoutVisible(false);
  };

  const showFlyout = () => {
    setIsFlyoutVisible(true);
  };

  let flyout;
  if (isFlyoutVisible) {
    flyout = (
      <ConfigureFlyout
        indexValue={indexValue}
        onChange={onChange}
        queryString={queryString}
        setQueryString={setQueryString}
        onClickHandler={onClickHandler}
        isLoading={isLoading}
        setIndexValue={setIndexValue}
        setQuerqyResult={setQuerqyResult}
        queryResult={querqyResult}
        closeFlyout={closeFlyout}
        setToast={setToast}
      />
    );
  }

  const toggleButtons = [
    {
      id: `edit-mode-btn`,
      label: 'Edit mode',
    },
    {
      id: `view-mode-btn`,
      label: 'View mode',
    },
  ];

  useEffect(() => {
    setBreadcrumbs([
      ...parentBreadCrumbs,
      {
        text: `${PLUGIN_EXPLORER_NAME}`,
        href: `#${PLUGIN_EXPLORER_URL}`,
      },
    ]);
  }, []);

  return (
    <RelevancySideBar>
      <EuiPage>
        <EuiPageBody component="main">
          <EuiPageHeader>
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiTitle size="l">
                  <h1>
                    {isEditMode && (
                      <FormattedMessage
                        id="relevancyWorkbench.title"
                        defaultMessage="{name}"
                        values={{ name: `${PLUGIN_EXPLORER_NAME}` }}
                      />
                    )}
                  </h1>
                </EuiTitle>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                {isEditMode && <EuiButton onClick={showFlyout}>Configure</EuiButton>}
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonGroup
                  style={{ marginTop: '5px' }}
                  legend="edit button selector"
                  options={toggleButtons}
                  idSelected={toggleIdSelected}
                  onChange={(id) => onChangeEdit(id)}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPageHeader>
          <EuiPageContentBody></EuiPageContentBody>
        </EuiPageBody>
      </EuiPage>
      {flyout}
    </RelevancySideBar>
  );
};