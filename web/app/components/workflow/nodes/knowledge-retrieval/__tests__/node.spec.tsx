import type { DataSet } from '@/models/datasets'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { IndexingType } from '@/app/components/datasets/create/step-two'
import { DatasetsDetailContext } from '@/app/components/workflow/datasets-detail-store/provider'
import { createDatasetsDetailStore } from '@/app/components/workflow/datasets-detail-store/store'
import { BlockEnum } from '@/app/components/workflow/types'
import { ChunkingMode, DatasetPermission, DataSourceType } from '@/models/datasets'
import { RETRIEVE_METHOD, RETRIEVE_TYPE } from '@/types/app'
import Node from '../node'

type DatasetWithOptionalIconInfo = Omit<DataSet, 'icon_info'> & {
  icon_info?: DataSet['icon_info']
}

describe('KnowledgeRetrievalNode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createMockDataset = (overrides: Partial<DatasetWithOptionalIconInfo> = {}): DatasetWithOptionalIconInfo => ({
    id: 'dataset-1',
    name: 'Knowledge Base One',
    description: 'Test dataset',
    indexing_status: 'completed',
    provider: 'vendor',
    permission: DatasetPermission.allTeamMembers,
    data_source_type: DataSourceType.FILE,
    indexing_technique: IndexingType.QUALIFIED,
    embedding_available: true,
    app_count: 1,
    document_count: 10,
    total_document_count: 10,
    word_count: 1000,
    updated_at: 1609545600,
    updated_by: 'user-1',
    tags: [],
    embedding_model: 'text-embedding-ada-002',
    embedding_model_provider: 'openai',
    created_by: 'user-1',
    doc_form: ChunkingMode.text,
    runtime_mode: 'general',
    enable_api: true,
    is_multimodal: false,
    built_in_field_enabled: false,
    icon_info: {
      icon: '📙',
      icon_type: 'emoji',
      icon_background: '#FFF4ED',
      icon_url: '',
    },
    retrieval_model_dict: {
      search_method: RETRIEVE_METHOD.semantic,
    } as DataSet['retrieval_model_dict'],
    retrieval_model: {
      search_method: RETRIEVE_METHOD.semantic,
    } as DataSet['retrieval_model'],
    external_knowledge_info: {
      external_knowledge_id: '',
      external_knowledge_api_id: '',
      external_knowledge_api_name: '',
      external_knowledge_api_endpoint: '',
    },
    external_retrieval_model: {
      top_k: 3,
      score_threshold: 0.5,
      score_threshold_enabled: false,
    },
    ...overrides,
  })

  const renderNode = (dataset: DatasetWithOptionalIconInfo) => {
    const store = createDatasetsDetailStore()
    store.setState({
      datasetsDetail: {
        [dataset.id]: dataset as DataSet,
      },
    })

    return render(
      <DatasetsDetailContext.Provider value={store}>
        <Node
          id="node-1"
          data={{
            title: 'Knowledge Retrieval',
            desc: 'Retrieve knowledge',
            type: BlockEnum.KnowledgeRetrieval,
            dataset_ids: [dataset.id],
            query_variable_selector: [],
            query_attachment_selector: [],
            retrieval_mode: RETRIEVE_TYPE.oneWay,
          }}
        />
      </DatasetsDetailContext.Provider>,
    )
  }

  describe('Rendering', () => {
    it('should render the selected dataset name', () => {
      const dataset = createMockDataset()

      renderNode(dataset)

      expect(screen.getByText('Knowledge Base One')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should render without crashing when icon_info is missing', () => {
      const dataset = createMockDataset({ icon_info: undefined })

      renderNode(dataset)

      expect(screen.getByText('Knowledge Base One')).toBeInTheDocument()
    })
  })
})
