import { Button, DatePicker, Form, Input, Modal, Radio, Select } from 'antd'
import React from 'react'

function editTransaction({ open, onCancel,onFinish }) {

  const [form] = Form.useForm()
  return (
    <Modal
      title="Edit transaction"
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={(values) => {
          onFinish(values)
          form.resetFields()
        }}
      >

        <Form.Item
          label="Edited Name"
          name="name"
          rules={[
              {required:true, message:"Please enter new name"}
          ]}
          labelCol={{ style: { marginBottom: 0 } }}
          style={{ margin: 0 }}
        >
          <Input type='text' className='custom__input' />
        </Form.Item>

        <Form.Item 
                label="Amount"
                name="amount"
                rules={[
                    {required:true, message:"Please enter name"}
                ]}
                labelCol={{ style: { margin: 0 } }}
                style={{ marginBottom: 0 }}
            >
                <Input type='number' className='custom__input' />
            </Form.Item>

            <Form.Item
                label="Date"
                name="date"
                rules={[
                    {required:true, message:"Please select an income date !"}
                ]}
                
            >
                <DatePicker format="YYYY-MM-DD" className='custome__input' />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please select a type!" }]}
            >
              <Radio.Group>
                <Radio value="income">Income</Radio>
                <Radio value="expense">Expense</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
                label="Tag"
                name="tag"
                rules={[
                    {required:true, message:"Please select an income date !"}
                ]}
            >
                <Select className='select__input'>
                    <Select.Option value="food">Food</Select.Option>
                    <Select.Option value="education">Education</Select.Option>
                    <Select.Option value="salary">Salary</Select.Option>
                    <Select.Option value="investment">Investment</Select.Option>
                    <Select.Option value="others">Others</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Button className="btn" type='primary' htmlType='submit' >Confirm Edit</Button>
            </Form.Item>

      </Form>
    </Modal>
  )
}

export default editTransaction